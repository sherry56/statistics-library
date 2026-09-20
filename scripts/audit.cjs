const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const items = vm.runInNewContext(fs.readFileSync(path.join(root,'js/resources.js'),'utf8') + ';resources');
const privateRosterPath = path.join(root, 'private', 'roster.js');
const publicRosterPath = path.join(root, 'resources', 'roster.js');
if (fs.existsSync(privateRosterPath)) {
  const roster = vm.runInNewContext(fs.readFileSync(privateRosterPath,'utf8') + ';LibraryRoster');
  assert.equal(roster.size, 122, 'Unexpected private roster size');
  assert.equal(new Set(roster.entries.map(item => item.studentId)).size, roster.size, 'Duplicate student ID');
}
assert.ok(!fs.existsSync(publicRosterPath) || fs.existsSync(privateRosterPath), 'Public roster must not contain student PII');
assert.ok(items.every(item => item.category !== '课程安排'), 'Removed category still present in catalog');
let found = 0, knownMissing = 0, pdfPreviews = 0;
for (const item of items) {
  const external = /^https?:\/\//i.test(item.path);
  if (external) {
    assert.match(item.path, /^https:\/\//i, 'External resource must use HTTPS: ' + item.title);
    found++;
    continue;
  }
  const exists = fs.existsSync(path.resolve(root,item.path));
  if (item.available === false) { assert.ok(!exists, 'Available again: remove stale availability flag'); knownMissing++; continue; }
  assert.ok(exists, item.path); found++;
  if (!['PDF','HTML','PPTX','PNG'].includes(item.format)) assert.ok(fs.existsSync(path.join(root,'resources','readers',path.basename(item.path)+'.html')), 'Missing reading copy: '+item.title);
}
const pptxPreviewRoot = path.join(root, 'resources', 'previews', 'pptx');
for (const item of items.filter(item => item.format === 'PPTX')) {
  const previewName = path.basename(item.path).replace(/\.pptx$/i, '.pdf');
  assert.ok(fs.existsSync(path.join(pptxPreviewRoot, previewName)), 'Missing PPTX PDF preview: ' + item.title);
  pdfPreviews++;
}
assert.ok(!fs.existsSync(path.join(root, 'readers', 'pptx-slides')), 'Stale PPTX slide images remain');
for (const item of items.filter(item => item.available !== false)) {
  assert.ok(/^https?:\/\//i.test(item.path) || !item.path.startsWith('../'), 'External resource path remains: ' + item.path);
}
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
for (const file of ['app.js','reader.js']) {
  const source = fs.readFileSync(path.join(root,'js',file),'utf8');
  for (const match of source.matchAll(/(?:querySelector\(|\$\()['"]#([\w-]+)['"]/g)) assert.ok(ids.has(match[1]), `Unresolved selector in ${file}: ${match[1]}`);
}
for (const match of html.matchAll(/(?:src|href)="((?:assets|js|styles|resources)\/[^"#]+)"/g)) assert.ok(fs.existsSync(path.join(root,match[1])),match[1]);
const css=fs.readFileSync(path.join(root,'assets/library.css'),'utf8');
for(const name of ['bg-canvas','bg-surface','bg-soft','text-ink','text-muted','text-brand','border-line','bg-brand','bg-brand-soft','bg-terracotta-soft','text-terracotta','bg-slate-blue-soft','text-slate-blue','bg-ochre-soft','text-ochre','border-brand']) assert.ok(css.includes('.'+name), 'Missing compiled utility: '+name);
assert.ok(css.includes('bg-brand-hover'), 'Missing compiled hover utility: bg-brand-hover');
assert.ok(!html.includes('<style>') && !fs.existsSync(path.join(root,'library.css')), 'Legacy CSS still present');
console.log(JSON.stringify({resources:items.length,available:found,knownMissing,pdfPreviews,selectors:'pass',compiledClasses:'pass'}));
