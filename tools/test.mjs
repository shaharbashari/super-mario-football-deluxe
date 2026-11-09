import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  ...readdirSync(root).filter(name => /^test_.*\.mjs$/.test(name)),
  ...readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.test.mjs'))
    .map(name => path.join('tests', name)),
];
const result = spawnSync(process.execPath, ['--test', ...process.argv.slice(2), ...files], {
  cwd: root, stdio: 'inherit',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
