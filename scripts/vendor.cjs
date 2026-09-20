// Build output only: keep browser dependencies local, including offline CJK fonts.
const fs = require('node:fs'), path = require('node:path');
const src = path.resolve(__dirname,'../node_modules/pdfjs-dist');
const dest = path.resolve(__dirname,'../assets/vendor/pdfjs');
fs.mkdirSync(dest,{recursive:true});
for (const file of ['pdf.mjs','pdf.worker.mjs']) fs.copyFileSync(path.join(src,'build',file),path.join(dest,file));
for (const dir of ['cmaps','standard_fonts','wasm']) fs.cpSync(path.join(src,dir),path.join(dest,dir),{recursive:true});
fs.copyFileSync(path.join(src,'LICENSE'),path.join(dest,'LICENSE'));
