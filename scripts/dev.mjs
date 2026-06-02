import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

spawn(process.execPath, [path.join(root, 'scripts', 'ensure-content-revision.mjs')], {
  cwd: root,
  stdio: 'inherit',
}).on('exit', (code) => {
  if (code !== 0) process.exit(code ?? 1);
  startDev();
});

function startDev() {
  const children = [];

  function run(label, command, args) {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', (exitCode, signal) => {
      if (signal) {
        shutdown(1);
        return;
      }
      if (exitCode && exitCode !== 0) {
        console.error(`[dev] ${label} exited with code ${exitCode}`);
        shutdown(exitCode);
      }
    });
    children.push(child);
    return child;
  }

  function shutdown(exitCode = 0) {
    for (const child of children) {
      if (!child.killed) child.kill('SIGTERM');
    }
    process.exit(exitCode);
  }

  process.on('SIGINT', () => shutdown(0));
  process.on('SIGTERM', () => shutdown(0));

  run('content-watch', process.execPath, [path.join(root, 'scripts', 'watch-content.mjs')]);
  run('next', process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', [
    'exec',
    'next',
    'dev',
    '--hostname',
    '0.0.0.0',
  ]);
}
