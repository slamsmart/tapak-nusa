// Convert pnpm symlinks under .open-next to junctions (esbuild can't follow pnpm relative symlinks on Windows)
const fs = require('fs');
const path = require('path');

const root = path.resolve('.open-next');
let converted = 0, failed = 0, skipped = 0;

function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isSymbolicLink()) {
      try {
        const raw = fs.readlinkSync(full);
        const target = path.isAbsolute(raw) ? raw : path.resolve(path.dirname(full), raw);
        if (!fs.existsSync(target)) { console.log('MISSING', full, '->', raw); failed++; continue; }
        fs.unlinkSync(full);
        fs.symlinkSync(target, full, 'junction');
        converted++;
      } catch (err) {
        console.log('ERR', full, err.message);
        failed++;
      }
    } else if (e.isDirectory()) {
      walk(full);
    }
  }
}

walk(root);
console.log(`converted=${converted} failed=${failed}`);
