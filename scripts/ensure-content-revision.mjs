import fs from 'node:fs';
import path from 'node:path';

const revisionFile = path.join(process.cwd(), 'lib', 'content-revision.ts');

if (!fs.existsSync(revisionFile)) {
  fs.writeFileSync(
    revisionFile,
    `/** Bumped by \`scripts/watch-content.mjs\` when files under \`content/\` change (dev only). */\nexport const CONTENT_REVISION = 0;\n`,
  );
}
