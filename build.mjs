// Zero-dependency bundler for Super Kick Kingdom
// Concatenates modular ES source files in topological order into dist/bundle.js
// so index.html works seamlessly via file://, local HTTP server, and itch.io!

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const order = [
  'src/config.js',
  'src/audio.js',
  'src/input.js',
  'src/touch.js',
  'src/art.js',
  'src/ai.js',
  'src/physics.js',
  'src/main.js',
];

let out = `/* Super Kick Kingdom — Auto-generated bundle from src/*.js (run: node build.mjs) */\n(() => {\n'use strict';\n`;

for (const rel of order) {
  const full = path.join(root, rel);
  let code = fs.readFileSync(full, 'utf8');
  // Strip ES module import statements
  code = code.replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
  // Strip 'export ' keywords while keeping declarations intact
  code = code.replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, '$1 ');
  out += `\n// === ${rel} ===\n${code}\n`;
}

out += `\n})();\n`;

const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });
const bundlePath = path.join(distDir, 'bundle.js');
fs.writeFileSync(bundlePath, out, 'utf8');
console.log(`Built ${bundlePath} (${(out.length / 1024).toFixed(1)} KB)`);
