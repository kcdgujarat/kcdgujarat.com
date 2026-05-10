import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  BlogFrontmatter,
  FaqFrontmatter,
  KeyDatesFrontmatter,
  SessionFrontmatter,
  SpeakerFrontmatter,
  SponsorFrontmatter,
} from '../lib/schema';

const ROOT = path.join(process.cwd(), 'content');

const targets: { dir: string; schema: any; name: string }[] = [
  { dir: 'speakers', schema: SpeakerFrontmatter, name: 'speaker' },
  { dir: 'sessions', schema: SessionFrontmatter, name: 'session' },
  { dir: 'sponsors', schema: SponsorFrontmatter, name: 'sponsor' },
  { dir: 'faq', schema: FaqFrontmatter, name: 'faq' },
  { dir: 'blog', schema: BlogFrontmatter, name: 'blog post' },
  { dir: 'pages', schema: KeyDatesFrontmatter, name: 'page' },
];

async function main() {
  let failed = 0;

  for (const { dir, schema, name } of targets) {
    const full = path.join(ROOT, dir);
    let entries: string[] = [];
    try {
      entries = await fs.readdir(full);
    } catch {
      continue;
    }
    for (const file of entries) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
      const raw = await fs.readFile(path.join(full, file), 'utf8');
      const { data } = matter(raw);
      const result = schema.safeParse(data);
      if (!result.success) {
        failed += 1;
        console.error(`✗ ${dir}/${file} (${name}):`);
        for (const issue of result.error.issues) {
          console.error(`    - ${issue.path.join('.')}: ${issue.message}`);
        }
      } else {
        console.log(`✓ ${dir}/${file}`);
      }
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} file(s) failed validation.`);
    process.exit(1);
  }
  console.log('\nAll content valid.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
