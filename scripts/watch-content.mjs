import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const revisionFile = path.join(cwd, 'lib', 'content-revision.ts');
const contentDir = path.join(cwd, 'content');

function isContentFile(name) {
  return typeof name === 'string' && (name.endsWith('.md') || name.endsWith('.mdx'));
}

function bumpRevision(reason) {
  const ts = Date.now();
  fs.writeFileSync(
    revisionFile,
    `/** Bumped by \`scripts/watch-content.mjs\` when files under \`content/\` change (dev only). */\nexport const CONTENT_REVISION = ${ts};\n`,
  );
  console.log(`[content-watch] ${reason} → revision ${ts}`);
}

function watchDir(dir) {
  fs.watch(dir, { recursive: true }, (_event, filename) => {
    if (isContentFile(filename)) {
      bumpRevision(`updated ${filename}`);
    }
  });
}

if (!fs.existsSync(contentDir)) {
  console.warn('[content-watch] content/ not found — skipping');
  process.exit(0);
}

bumpRevision('dev start');
watchDir(contentDir);
console.log('[content-watch] watching content/ for .md / .mdx changes');
