import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  FaqFrontmatter,
  KeyDatesFrontmatter,
  SessionFrontmatter,
  SpeakerFrontmatter,
  SponsorFrontmatter,
  TeamFrontmatter,
  PartnerFrontmatter,
  CfpConfigFrontmatter,
  SponsorshipConfigFrontmatter,
  RegistrationConfigFrontmatter,
  EventConfigFrontmatter,
  SocialLinksFrontmatter,
} from '../lib/schema';

const ROOT = path.join(process.cwd(), 'content');

const targets: { dir: string; schema: any; name: string; fileSchema?: Record<string, any> }[] = [
  { dir: 'speakers', schema: SpeakerFrontmatter, name: 'speaker' },
  { dir: 'sessions', schema: SessionFrontmatter, name: 'session' },
  { dir: 'sponsors', schema: SponsorFrontmatter, name: 'sponsor' },
  { dir: 'faq', schema: FaqFrontmatter, name: 'faq' },
  {
    dir: 'pages',
    schema: KeyDatesFrontmatter,
    name: 'page',
    fileSchema: {
      'cfp.md': CfpConfigFrontmatter,
      'sponsorship.md': SponsorshipConfigFrontmatter,
      'registration.md': RegistrationConfigFrontmatter,
      'event.md': EventConfigFrontmatter,
      'social.md': SocialLinksFrontmatter,
    },
  },
  { dir: 'team', schema: TeamFrontmatter, name: 'team member' },
  { dir: 'partners', schema: PartnerFrontmatter, name: 'community partner' },
];

async function main() {
  let failed = 0;

  for (const { dir, schema, name, fileSchema } of targets) {
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
      const effectiveSchema = fileSchema?.[file] ?? schema;
      const result = effectiveSchema.safeParse(data);
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
