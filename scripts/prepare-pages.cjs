const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.pages-dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

fs.copyFileSync(path.join(root, 'index.html'), path.join(output, 'index.html'));
fs.copyFileSync(path.join(root, 'stats.html'), path.join(output, 'stats.html'));
fs.copyFileSync(path.join(root, '_headers'), path.join(output, '_headers'));
for (const directory of ['assets', 'js', 'styles', 'functions']) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), { recursive: true });
}
fs.cpSync(path.join(root, 'resources'), path.join(output, 'resources'), {
  recursive: true,
  filter(source) {
    if (path.normalize(source) === path.join(root, 'resources', 'roster.js')) return false;
    if (path.extname(source).toLowerCase() === '.epub' && fs.statSync(source).size > 25 * 1024 * 1024) return false;
    return true;
  }
});

console.log(`Prepared Pages directory: ${path.relative(root, output)}`);
