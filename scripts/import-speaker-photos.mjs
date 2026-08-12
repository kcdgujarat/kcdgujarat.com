#!/usr/bin/env node
/**
 * Import the Sessionize "speakers photo export" into public/images/speakers/.
 *
 *   node scripts/import-speaker-photos.mjs "<export>.zip"
 *   node scripts/import-speaker-photos.mjs ./some-folder-of-photos
 *
 * Photos are copied byte for byte — nothing here crops, scales, pads, or
 * re-encodes. The export mixes orientations (0.56 to 1.40 aspect in the August
 * 2026 one); the square frames on /speakers and the detail page fill with a
 * centred `object-cover`, so the tiles look uniform while the file in Git stays
 * exactly what the speaker sent. Squaring the file itself — by cropping, or by
 * padding onto a canvas — was tried and rejected; see handoff.md.
 *
 * Each file keeps its own format and carries a digest of its bytes in the name,
 * and the `photo:` line in the speaker markdown is rewritten to the file that
 * landed — so a PNG can't end up referenced as a .jpg, and a corrected photo
 * can't be served from an image cache keyed on the old URL.
 *
 * Filenames are `First_Last`, matched to the slug of the speaker markdown that
 * scripts/import-sessionize.py generated. Unmatched files are a hard error, so
 * a renamed speaker never silently keeps a stale photo.
 */

import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPEAKER_DIR = path.join(ROOT, 'content', 'speakers');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'speakers');

/** CLAUDE.md asks for 512px minimum on the short edge; warn rather than upscale. */
const MIN_EDGE = 512;

/** Export filenames keep Sessionize's raw name fields; these don't slugify to our slug. */
const SLUG_ALIASES = {
  'amritansh-amritansh': 'amritansh',
  'darshil-na': 'darshil',
  'shivam-anirudh-nandy': 'shivam-nandy',
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function collectPhotos(source) {
  const stat = fs.statSync(source);
  const dir = stat.isDirectory()
    ? source
    : (() => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kcd-photos-'));
        execFileSync('unzip', ['-q', '-o', source, '-d', tmp]);
        return tmp;
      })();

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

function knownSlugs() {
  return new Set(
    fs
      .readdirSync(SPEAKER_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, '')),
  );
}

/** Same bytes either way; `.jpeg` just keeps the paths predictable. */
function extensionOf(file) {
  const ext = path.extname(file).toLowerCase();
  return ext === '.jpeg' ? '.jpg' : ext;
}

/**
 * next/image and every CDN in front of it cache by URL. A replaced photo under
 * the same filename kept serving the previous crop for as long as that cache
 * lived, so the filename carries a digest of the bytes: new photo, new URL.
 */
function fileName(bytes, slug, ext) {
  const digest = crypto.createHash('sha256').update(bytes).digest('hex');
  return `${slug}-${digest.slice(0, 8)}${ext}`;
}

/** EXIF orientation can swap the stored dimensions relative to how it displays. */
async function displaySize(file) {
  const { width, height, orientation } = await sharp(file).metadata();
  const swapped = (orientation ?? 1) >= 5;
  return { width: swapped ? height : width, height: swapped ? width : height };
}

/** Anything this speaker was stored as before: bare, hashed, or another format. */
function removeStale(slug, keep) {
  const mine = new RegExp(`^${slug}(-[0-9a-f]{8})?\\.(jpe?g|png|webp)$`);
  for (const name of fs.readdirSync(OUT_DIR)) {
    if (name !== keep && mine.test(name)) fs.rmSync(path.join(OUT_DIR, name));
  }
}

function pointMarkdownAt(slug, publicPath) {
  const file = path.join(SPEAKER_DIR, `${slug}.md`);
  const before = fs.readFileSync(file, 'utf8');
  const line = `photo: ${JSON.stringify(publicPath)}`;
  let after;
  if (/^photo:.*$/m.test(before)) {
    after = before.replace(/^photo:.*$/m, line);
  } else if (/^name:.*$/m.test(before)) {
    after = before.replace(/^(name:.*)$/m, `$1\n${line}`);
  } else {
    throw new Error(`${slug}.md has neither a photo: nor a name: field to anchor to`);
  }
  if (after === before) return false;
  fs.writeFileSync(file, after);
  return true;
}

async function main() {
  const source = process.argv[2];
  if (!source) {
    console.error('usage: node scripts/import-speaker-photos.mjs <export.zip|directory>');
    process.exit(1);
  }

  const slugs = knownSlugs();
  const photos = collectPhotos(source);
  const unmatched = [];
  const written = new Map();
  const lowRes = [];
  let repointed = 0;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const file of photos) {
    const stem = path.basename(file, path.extname(file)).replace(/_/g, ' ');
    const raw = slugify(stem);
    const slug = SLUG_ALIASES[raw] ?? raw;
    if (!slugs.has(slug)) {
      unmatched.push(`${path.basename(file)} → ${slug}`);
      continue;
    }

    const bytes = fs.readFileSync(file);
    const name = fileName(bytes, slug, extensionOf(file));
    removeStale(slug, name);
    fs.writeFileSync(path.join(OUT_DIR, name), bytes);

    const { width, height } = await displaySize(file);
    written.set(slug, bytes.length);
    if (Math.min(width, height) < MIN_EDGE) lowRes.push(`${slug} (${width}×${height})`);
    if (pointMarkdownAt(slug, `/images/speakers/${name}`)) repointed += 1;
  }

  if (unmatched.length > 0) {
    console.error(`no speaker markdown matches:\n  ${unmatched.join('\n  ')}`);
    process.exit(1);
  }

  const totalMb = ([...written.values()].reduce((a, b) => a + b, 0) / 1024 ** 2).toFixed(1);
  console.log(`copied ${written.size} photos unmodified (${totalMb} MB) to public/images/speakers`);
  if (repointed > 0) console.log(`updated the photo: path in ${repointed} speaker markdown files`);

  const missing = [...slugs].filter((slug) => !written.has(slug)).sort();
  if (missing.length > 0) {
    console.warn(`warning: no photo in this export for ${missing.join(', ')}`);
  }
  if (lowRes.length > 0) {
    console.warn(`warning: below the ${MIN_EDGE}px minimum — ask for a bigger file:`);
    console.warn(`  ${lowRes.join('\n  ')}`);
  }
}

await main();
