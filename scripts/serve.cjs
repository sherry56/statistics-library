// Local-only static preview. The project is self-contained; resources live under ./resources.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.pdf':'application/pdf', '.png':'image/png', '.jpg':'image/jpeg', '.md':'text/plain; charset=utf-8', '.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation', '.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const decoded = decodeURIComponent(url.pathname);
    const file = path.resolve(root, '.' + decoded + (decoded.endsWith('/') ? 'index.html' : ''));
    if (!file.startsWith(root + path.sep) || file.includes(path.sep + 'node_modules' + path.sep)) { res.writeHead(403).end(); return; }
    const stat = fs.statSync(file);
    if (!stat.isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': path.extname(file) === '.mjs' ? 'text/javascript' : path.extname(file) === '.wasm' ? 'application/wasm' : mime[path.extname(file)] || 'application/octet-stream', 'Content-Length': stat.size, 'Cache-Control':'no-store' });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end('File not found'); }
});
const port = Number(process.env.PORT || 8766);
server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}/`));
