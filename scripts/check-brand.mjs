#!/usr/bin/env node
/**
 * Fails on any spelling of *our* event's name other than the canonical one in
 * lib/brand.ts. The name drifted into five variants at once ("KCD Gujarat 2026",
 * "KCD Gujarat", "Kubernetes Community Days Gujarat 2026", "Kubernetes Community
 * Day, Gujarat", "Kubernetes Community Days (KCD) Gujarat"); this keeps it at one.
 *
 * Not variants, and deliberately allowed:
 *   - other KCDs in speaker bios and abstracts (KCD Pune, KCD Bengaluru, KCDs)
 *   - the plural CNCF programme ("Kubernetes Community Days are ...")
 *   - "KCD is a CNCF program"
 *   - handles, hashtags, filenames and the domain (@KCDGujarat, kcdgujarat.com)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CANONICAL = 'Kubernetes Community Day (KCD) Gujarat 2026';

const ROOTS = ['app', 'components', 'lib', 'content', 'messages', 'public/og'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.md', '.mdx', '.json']);

/** A hit is a variant unless one of these explains it. */
const ALLOWED = [
  /KCD (Bengaluru|Kochi|Pune|Chennai|Mumbai|Hyderabad|Delhi|Bangalore)/,
  /Kubernetes Community Days (are|,|\{)/,
  /Kubernetes Community Days \(KCD\) Pune/,
  /KCDs\b/,
  /KCD is a CNCF program/,
  /KCD events are/,
  /[@#]KCDGujarat/,
  /KCDGujarat(Logo|2026)/,
  /KCD-Gujarat-2026-Im-Attending/,
  /KCD%20Gujarat%202026/,
  /kcdgujarat/i,
  /kcd-[a-z]/,
];

/**
 * Anything that looks like it is naming this event. Bounded on both ends — an
 * unbounded tail would swallow the words after a correct name and report it as
 * a variant of itself.
 */
const CITY = '(?:Gujarat|\\u0a97\\u0ac1\\u0a9c\\u0ab0\\u0abe\\u0aa4)';
const SUSPECT = new RegExp(
  [
    // "Kubernetes Community Day(s)[ (KCD)][,] Gujarat[ 2026]"
    `Kubernetes Community Days?(?: \\(KCD\\))?,? ${CITY}(?: 2026)?`,
    // "KCD Gujarat[ 2026]", hyphenated forms included
    `KCD[ \\-\\u2013\\u2014]+${CITY}(?:[ \\-\\u2013\\u2014]+2026)?`,
    // bare "Kubernetes Community Day" used as if it were the event's name
    // bare "Kubernetes Community Day" used as if it were the event's name.
    // `(KCD)` may follow across a JSX boundary, so the canonical prefix is not a hit.
    'Kubernetes Community Day(?!s)(?! \\(KCD\\))',
  ].join('|'),
  'g',
);

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(path.extname(e.name))) yield full;
  }
}

const problems = [];
for (const root of ROOTS) {
  for (const file of walk(path.join(ROOT, root))) {
    const rel = path.relative(ROOT, file);
    if (rel === 'lib/brand.ts') continue;
    const text = fs.readFileSync(file, 'utf8');
    text.split('\n').forEach((line, i) => {
      for (const m of line.matchAll(SUSPECT)) {
        const hit = m[0].trim();
        if (hit === CANONICAL) continue;
        // Test a forward window, not just the hit: the match stops short of the
        // context that explains it (KCD-Gujarat-2026-Im-Attending.png). Testing
        // the whole line instead would let an unrelated allowed token elsewhere
        // on it mask a real variant.
        const context = line.slice(m.index, m.index + hit.length + 40);
        if (ALLOWED.some((re) => re.test(context))) continue;
        problems.push(`${rel}:${i + 1}  ${hit}`);
      }
    });
  }
}

if (problems.length > 0) {
  console.error(`Event name must be exactly "${CANONICAL}" — import EVENT_NAME from lib/brand.\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\n${problems.length} variant${problems.length === 1 ? '' : 's'} found.`);
  process.exit(1);
}
console.log(`brand check: event name is "${CANONICAL}" everywhere`);
