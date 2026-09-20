"""Create local reading copies without modifying source documents."""
from pathlib import Path
import html
import json
import re
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'resources' / 'readers'
OUT.mkdir(exist_ok=True)
source = (ROOT / 'js' / 'resources.js').read_text(encoding='utf-8')
paths = re.findall(r'"path"\s*:\s*"([^"]+)"', source)

def esc(value):
    return html.escape(str(value))

def paragraphs(root):
    return [''.join(e.itertext()).strip() for e in root.iter() if e.tag.endswith('}t') and ''.join(e.itertext()).strip()]

for relative in paths:
    file = (ROOT / relative).resolve()
    if not file.exists():
        continue
    ext = file.suffix.lower()
    if ext not in ('.pptx', '.xlsx', '.md', '.xmind', '.epub'):
        continue
    sections = []
    note = ''
    if ext == '.md':
        sections = ['<pre>' + esc(file.read_text(encoding='utf-8')) + '</pre>']
    else:
        with zipfile.ZipFile(file) as archive:
            names = archive.namelist()
            if ext == '.pptx':
                note = '课件文字阅读版 · 图表、公式及原始版式请以下载的课件为准。'
                slides = sorted((n for n in names if re.fullmatch(r'ppt/slides/slide\d+.xml', n)), key=lambda n: int(re.search(r'slide(\d+)', n).group(1)))
                for i, name in enumerate(slides, 1):
                    root = ET.fromstring(archive.read(name))
                    lines = []
                    for p in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}p'):
                        text = ''.join(p.itertext()).strip()
                        if text:
                            lines.append('<p>' + esc(text) + '</p>')
                    sections.append(f'<section><small>第 {i} 页</small>' + ''.join(lines or ['<p>本页主要为图表内容，请查看原课件。</p>']) + '</section>')
            elif ext == '.xlsx':
                shared = []
                ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                if 'xl/sharedStrings.xml' in names:
                    shared = [''.join(n.itertext()) for n in ET.fromstring(archive.read('xl/sharedStrings.xml')).findall('m:si', ns)]
                for name in sorted(n for n in names if re.fullmatch(r'xl/worksheets/sheet\d+.xml', n)):
                    rows = []
                    for row in ET.fromstring(archive.read(name)).findall('.//m:row', ns):
                        cells = []
                        for c in row.findall('m:c', ns):
                            value = c.findtext('m:v', '', ns)
                            if c.get('t') == 's': value = shared[int(value)]
                            if c.get('t') == 'inlineStr': value = ''.join(c.find('m:is', ns).itertext())
                            cells.append('<td>' + esc(value) + '</td>')
                        rows.append('<tr>' + ''.join(cells) + '</tr>')
                    sections.append('<section><table>' + ''.join(rows) + '</table></section>')
            elif ext == '.xmind':
                if 'content.json' in names:
                    data = json.loads(archive.read('content.json'))
                    def walk(obj):
                        result = []
                        if isinstance(obj, dict):
                            if obj.get('title'): result.append('<li>' + esc(obj['title']) + '</li>')
                            for value in obj.values():
                                if isinstance(value, (dict, list)): result.append('<ul>' + walk(value) + '</ul>')
                        elif isinstance(obj, list):
                            result += [walk(value) for value in obj]
                        return ''.join(result)
                    sections = ['<section>' + walk(data) + '</section>']
                else:
                    root = ET.fromstring(archive.read('content.xml'))
                    sections = ['<section>' + ''.join('<p>' + esc(e.text) + '</p>' for e in root.iter() if e.tag.endswith('}title') and e.text) + '</section>']
                note = '知识导图文字大纲 · 完整层级与布局请查看原文件。'
            else:
                note = '电子书文字阅读版 · 插图和完整排版请以原文件为准。'
                for name in (n for n in names if n.endswith(('.html', '.xhtml', '.htm'))):
                    try:
                        root = ET.fromstring(archive.read(name))
                        texts = [' '.join(e.itertext()).strip() for e in root.iter() if e.tag.split('}')[-1] in ('h1','h2','h3','p')]
                        sections.append('<section>' + ''.join('<p>' + esc(t) + '</p>' for t in texts if t) + '</section>')
                    except ET.ParseError:
                        continue
    page = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(file.stem) + '</title><style>body{margin:0;background:#faf8f3;color:#2f3437;font:15px/1.9 "Microsoft YaHei",sans-serif}main{max-width:820px;margin:24px auto;padding:0 18px}section{background:#fffdf8;border:1px solid #e7ddd0;padding:24px;margin:18px 0;border-radius:6px;overflow:auto}h1{font-size:23px}small,.note{color:#8d857c;font-size:12px}p{white-space:pre-wrap;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}td{border:1px solid #e7ddd0;padding:8px;min-width:80px}table{border-collapse:collapse}</style><main><h1>' + esc(file.stem) + '</h1><p class="note">' + note + '</p>' + ''.join(sections) + '</main></html>'
    (OUT / (file.name + '.html')).write_text(page, encoding='utf-8')
    print(file.name, len(sections), 'sections')
