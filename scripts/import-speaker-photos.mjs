#!/usr/bin/env node
/**
 * Import the Sessionize "speakers photo export" into public/images/speakers/.
 *
 *   node scripts/import-speaker-photos.mjs "<export>.zip"
 *   node scripts/import-speaker-photos.mjs ./some-folder-of-photos
 *
 * Sessionize exports originals — anywhere from 400px to 2048px, mixed
 * orientation, some PNGs over 2 MB. Every speaker card and detail page renders
 * a square, so we crop square here rather than letting `object-cover` guess at
 * runtime: what lands in Git is what ships.
 *
 * Filenames are `First_Last`, matched to the slug of the speaker markdown that
 * scripts/import-sessionize.py generated. Unmatched files are a hard error, so
 * a renamed speaker never silently keeps a stale photo.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPEAKER_DIR = path.join(ROOT, 'content', 'speakers');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'speakers');

const SIZE = 800;
const QUALITY = 82;

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
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
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

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const file of photos) {
    const stem = path.basename(file, path.extname(file)).replace(/_/g, ' ');
    const raw = slugify(stem);
    const slug = SLUG_ALIASES[raw] ?? raw;
    if (!slugs.has(slug)) {
      unmatched.push(`${path.basename(file)} → ${slug}`);
      continue;
    }

    const target = path.join(OUT_DIR, `${slug}.jpg`);
    await sharp(file)
      // Honour EXIF orientation before cropping, and crop toward the subject
      // so portrait headshots don't lose the face to a centred square.
      .rotate()
      .resize(SIZE, SIZE, {
        fit: 'cover',
        position: sharp.strategy.attention,
        withoutEnlargement: false,
      })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(target);

    written.set(slug, fs.statSync(target).size);
  }

  if (unmatched.length > 0) {
    console.error(`no speaker markdown matches:\n  ${unmatched.join('\n  ')}`);
    process.exit(1);
  }

  const missing = [...slugs].filter((slug) => !written.has(slug)).sort();
  const totalKb = Math.round([...written.values()].reduce((a, b) => a + b, 0) / 1024);
  console.log(`wrote ${written.size} photos (${totalKb} KB total) to public/images/speakers`);
  if (missing.length > 0) {
    console.warn(`warning: no photo in this export for ${missing.join(', ')}`);
  }
}

await main();
