// Zero-dependency bundler for Super Kick Kingdom
// Concatenates modular ES source files in topological order into dist/bundle.js
// so index.html works seamlessly via file://, local HTTP server, and itch.io!

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import { createHash } from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const order = [
  'src/config.js',
  'src/audio.js',
  'src/input.js',
  'src/touch.js',
  'src/animation.js',
  'src/coach.js',
  'src/online-state.js',
  'src/online.js',
  'src/art.js',
  'src/ai.js',
  'src/physics.js',
  'src/online-ui.js',
  'src/main.js',
];

let out = `/* Super Kick Kingdom — Auto-generated bundle from src/*.js (run: node build.mjs) */\n(() => {\n'use strict';\n`;

for (const rel of order) {
  const full = path.join(root, rel);
  let code = fs.readFileSync(full, 'utf8').replace(/\r\n?/g, '\n');
  // Strip ES module import statements
  code = code.replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
  // Strip 'export ' keywords while keeping declarations intact
  code = code.replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, '$1 ');
  out += `\n// === ${rel} ===\n${code}\n`;
}

out += `\n})();\n`;
new Script(out, { filename: 'dist/bundle.js' });

const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });
const bundlePath = path.join(distDir, 'bundle.js');
const peerSource = path.join(root, 'node_modules', 'peerjs', 'dist', 'peerjs.min.js');
if (!fs.existsSync(peerSource)) throw new Error('PeerJS is missing. Run npm ci before building.');
const peerCode = fs.readFileSync(peerSource, 'utf8').replace(/\r\n?/g, '\n');
const peerPackages = ['peerjs', '@msgpack/msgpack', 'eventemitter3', 'peerjs-js-binarypack', 'webrtc-adapter', 'sdp'];
const peerLicense = peerPackages.map(name => {
  const directory = path.join(root, 'node_modules', name);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
  const license = fs.readdirSync(directory).find(file => /^licen[cs]e(?:\.md|\.txt)?$/i.test(file));
  if (!license) throw new Error(`Missing redistribution notice for ${name}.`);
  return `${name} ${metadata.version}\n\n${fs.readFileSync(path.join(directory, license), 'utf8').replace(/\r\n?/g, '\n')}`;
}).join('\n\n----------------------------------------\n\n');
const peerOutput = path.join(distDir, 'peerjs.min.js');
const licenseOutput = path.join(distDir, 'peerjs.LICENSE');
const indexPath = path.join(root, 'index.html');
const index = fs.readFileSync(indexPath, 'utf8').replace(/\r\n?/g, '\n');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8').replace(/\r\n?/g, '\n');
const fingerprint = content => createHash('sha256').update(content).digest('hex').slice(0, 12);
const styleReference = /href="\.\/styles\.css(?:\?v=[^"]*)?"/;
const scriptReference = /src="\.\/dist\/bundle\.js(?:\?v=[^"]*)?"/;
const peerReference = /src="\.\/dist\/peerjs\.min\.js(?:\?v=[^"]*)?"/;
if (!styleReference.test(index) || !scriptReference.test(index) || !peerReference.test(index)) {
  throw new Error('index.html must reference styles.css and dist/bundle.js for cache-safe deployment.');
}
const versionedIndex = index
  .replace(styleReference, `href="./styles.css?v=${fingerprint(css)}"`)
  .replace(peerReference, `src="./dist/peerjs.min.js?v=${fingerprint(peerCode)}"`)
  .replace(scriptReference, `src="./dist/bundle.js?v=${fingerprint(out)}"`);
if (process.argv.includes('--check')) {
  const existing = fs.existsSync(bundlePath) ? fs.readFileSync(bundlePath, 'utf8').replace(/\r\n?/g, '\n') : '';
  const peerCurrent = fs.existsSync(peerOutput) && fs.readFileSync(peerOutput, 'utf8').replace(/\r\n?/g, '\n') === peerCode;
  const licenseCurrent = fs.existsSync(licenseOutput) && fs.readFileSync(licenseOutput, 'utf8').replace(/\r\n?/g, '\n') === peerLicense;
  if (existing !== out || index !== versionedIndex || !peerCurrent || !licenseCurrent) {
    console.error('The bundle or asset fingerprints are out of date. Run npm run build.');
    process.exitCode = 1;
  } else console.log('Bundle matches the source.');
} else {
  fs.writeFileSync(bundlePath, out, 'utf8');
  fs.writeFileSync(peerOutput, peerCode, 'utf8');
  fs.writeFileSync(licenseOutput, peerLicense, 'utf8');
  if (index !== versionedIndex) fs.writeFileSync(indexPath, versionedIndex, 'utf8');
  console.log(`Built ${bundlePath} (${(out.length / 1024).toFixed(1)} KB)`);
}
