const fs = require('node:fs');
const path = require('node:path');

const runtimeDir = path.join(process.cwd(), 'node_modules', '@prisma', 'client', 'runtime');
const libraryJs = path.join(runtimeDir, 'library.js');
const libraryDts = path.join(runtimeDir, 'library.d.ts');

if (!fs.existsSync(runtimeDir)) {
  process.exit(0);
}

if (!fs.existsSync(libraryJs)) {
  fs.writeFileSync(
    libraryJs,
    "module.exports = require('./client.js');\n",
    'utf8',
  );
}

if (!fs.existsSync(libraryDts)) {
  fs.writeFileSync(
    libraryDts,
    "export * from './client';\n",
    'utf8',
  );
}