import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { ensureDevContentFresh } from './content-fresh';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import {
  FaqFrontmatter,
  SessionFrontmatter,
  SpeakerFrontmatter,
  SponsorFrontmatter,
  TeamFrontmatter,
  PartnerFrontmatter,
  CfpConfigFrontmatter,
  CfpHomeSection,
  RegistrationConfigFrontmatter,
  EventConfigFrontmatter,
  SocialLinksFrontmatter,
  SponsorshipConfigFrontmatter,
  isPublished,
} from './schema';
import type { SiteSocialLinks } from './site-social';

const ROOT = path.join(process.cwd(), 'content');

async function listMarkdown(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(path.join(ROOT, dir));
    return entries.filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  } catch {
    return [];
  }
}

async function readMarkdown(dir: string, file: string) {
  const raw = await fs.readFile(path.join(ROOT, dir, file), 'utf8');
  const { data, content } = matter(raw);
  return { data, content };
}

export async function renderMarkdown(md: string): Promise<string> {
  ensureDevContentFresh();
  const file = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(md);
  return String(file);
}

function slugFromFile(file: string) {
  return file.replace(/\.(md|mdx)$/, '');
}

function publishedOnly<T extends { render?: boolean }>(items: T[]): T[] {
  return items.filter(isPublished);
}

export type Speaker = SpeakerFrontmatter & {
  slug: string;
  bio: string;
  bioHtml: string;
  photoUrl?: string;
};

export async function getSpeakers(): Promise<Speaker[]> {
  ensureDevContentFresh();
  const files = await listMarkdown('speakers');
  const md: Speaker[] = [];
  for (const f of files) {
    if (f.includes('.gu.')) continue;
    const { data, content } = await readMarkdown('speakers', f);
    const parsed = SpeakerFrontmatter.parse(data);
    if (!isPublished(parsed)) continue;
    md.push({
      ...parsed,
      slug: slugFromFile(f),
      bio: content,
      bioHtml: await renderMarkdown(content),
      photoUrl: parsed.photo,
    });
  }
  return md.sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name));
}

export type Session = SessionFrontmatter & {
  slug: string;
  abstract: string;
  abstractHtml: string;
};

export async function getSessions(): Promise<Session[]> {
  ensureDevContentFresh();
  const files = await listMarkdown('sessions');
  const md: Session[] = [];
  for (const f of files) {
    if (f.includes('.gu.')) continue;
    const { data, content } = await readMarkdown('sessions', f);
    const parsed = SessionFrontmatter.parse(data);
    if (!isPublished(parsed)) continue;
    md.push({
      ...parsed,
      slug: slugFromFile(f),
      abstract: content,
      abstractHtml: await renderMarkdown(content),
    });
  }
  return md.sort((a, b) => (a.start || '').localeCompare(b.start || ''));
}

export type Sponsor = SponsorFrontmatter & {
  slug: string;
  description: string;
  logoUrl?: string;
};

export async function getSponsors(): Promise<Sponsor[]> {
  ensureDevContentFresh();
  const files = await listMarkdown('sponsors');
  const md: Sponsor[] = [];
  for (const f of files) {
    const { data, content } = await readMarkdown('sponsors', f);
    const parsed = SponsorFrontmatter.parse(data);
    if (!isPublished(parsed)) continue;
    md.push({
      ...parsed,
      slug: slugFromFile(f),
      description: content,
      logoUrl: parsed.logo,
    });
  }
  return md.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

export type Faq = FaqFrontmatter & { slug: string; answer: string; answerHtml: string };

export async function getFaqs(): Promise<Faq[]> {
  ensureDevContentFresh();
  const files = await listMarkdown('faq');
  const md: Faq[] = [];
  for (const f of files) {
    const { data, content } = await readMarkdown('faq', f);
    const parsed = FaqFrontmatter.parse(data);
    if (!isPublished(parsed)) continue;
    md.push({
      ...parsed,
      slug: slugFromFile(f),
      answer: content,
      answerHtml: await renderMarkdown(content),
    });
  }
  return md.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

export type FaqSection = { section: string; faqs: Faq[] };

/**
 * FAQs grouped by their `section`. Sections appear in the order their first
 * (lowest-`order`) question does, so section sequencing is controlled by the
 * same `order` numbers that sort questions within a section.
 */
export async function getFaqSections(): Promise<FaqSection[]> {
  const faqs = await getFaqs();
  const groups: FaqSection[] = [];
  const index = new Map<string, FaqSection>();
  for (const faq of faqs) {
    let group = index.get(faq.section);
    if (!group) {
      group = { section: faq.section, faqs: [] };
      index.set(faq.section, group);
      groups.push(group);
    }
    group.faqs.push(faq);
  }
  return groups;
}

export type Partner = PartnerFrontmatter & {
  slug: string;
  logoUrl?: string;
};

export async function getPartners(): Promise<Partner[]> {
  ensureDevContentFresh();
  const files = await listMarkdown('partners');
  const md: Partner[] = [];
  for (const f of files) {
    if (f.includes('.gu.')) continue;
    const { data } = await readMarkdown('partners', f);
    const parsed = PartnerFrontmatter.parse(data);
    if (!isPublished(parsed)) continue;
    md.push({
      ...parsed,
      slug: slugFromFile(f),
      logoUrl: parsed.logo,
    });
  }
  return publishedOnly(md).sort(
    (a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name),
  );
}

export type TeamMember = TeamFrontmatter & {
  slug: string;
  bio: string;
  bioHtml: string;
  photoUrl?: string;
};

export async function getTeam(): Promise<TeamMember[]> {
  ensureDevContentFresh();
  const files = await listMarkdown('team');
  const md: TeamMember[] = [];
  for (const f of files) {
    if (f.includes('.gu.')) continue;
    const { data, content } = await readMarkdown('team', f);
    const parsed = TeamFrontmatter.parse(data);
    if (!isPublished(parsed)) continue;
    md.push({
      ...parsed,
      slug: slugFromFile(f),
      bio: content,
      bioHtml: await renderMarkdown(content),
      photoUrl: parsed.photo,
    });
  }
  return publishedOnly(md).sort(
    (a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name),
  );
}

export type CfpConfig = CfpConfigFrontmatter & {
  body: string;
  bodyHtml: string;
};

export async function getCfpConfig(): Promise<CfpConfig> {
  ensureDevContentFresh();
  let raw: string;
  try {
    raw = await fs.readFile(path.join(ROOT, 'pages', 'cfp.md'), 'utf8');
  } catch {
    return {
      startDate: '',
      endDate: '',
      open: false,
      phase: 'upcoming' as const,
      deadline: '',
      timezone: 'Asia/Kolkata',
      showSpeakers: false,
      eyebrow: 'CFP',
      title: 'Call for Proposals',
      description: '',
      homeSection: CfpHomeSection.parse({}),
      body: '',
      bodyHtml: '',
    };
  }

  const { data, content } = matter(raw);
  const result = CfpConfigFrontmatter.safeParse(data);
  if (!result.success) {
    const details = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid content/pages/cfp.md — ${details}`);
  }

  const parsed = result.data;
  const body = content.trim();
  return {
    ...parsed,
    body,
    bodyHtml: body ? await renderMarkdown(body) : '',
  };
}

export type SponsorshipConfig = SponsorshipConfigFrontmatter & {
  /** Resolved download URL — `/static/…` or external override. */
  prospectusUrl?: string;
};

const STATIC_ROOT = path.join(process.cwd(), 'static');

async function resolveProspectusUrl(
  config: SponsorshipConfigFrontmatter,
): Promise<string | undefined> {
  if (config.prospectusUrl) return config.prospectusUrl;

  const filename = config.prospectus ?? 'prospectus.pdf';
  const filePath = path.join(STATIC_ROOT, filename);
  const normalizedRoot = path.normalize(STATIC_ROOT + path.sep);
  if (!path.normalize(filePath).startsWith(normalizedRoot)) return undefined;

  try {
    await fs.access(filePath);
    return `/static/${filename.split(path.sep).join('/')}`;
  } catch {
    return undefined;
  }
}

export async function getSponsorshipConfig(): Promise<SponsorshipConfig> {
  ensureDevContentFresh();
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'sponsorship.md'), 'utf8');
    const { data } = matter(raw);
    const parsed = SponsorshipConfigFrontmatter.parse(data);
    const prospectusUrl = await resolveProspectusUrl(parsed);
    return {
      ...parsed,
      tiers: publishedOnly(parsed.tiers),
      prospectusUrl,
    };
  } catch {
    return { tiers: [] };
  }
}

export type EventConfig = EventConfigFrontmatter;

export async function getEventConfig(): Promise<EventConfig> {
  ensureDevContentFresh();
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'event.md'), 'utf8');
    const { data } = matter(raw);
    const parsed = EventConfigFrontmatter.parse(data);
    return {
      ...parsed,
      timeline: parsed.timeline ? publishedOnly(parsed.timeline) : parsed.timeline,
    };
  } catch {
    return { city: 'Gujarat, India', showTeam: false };
  }
}

export type { SiteSocialLinks } from './site-social';

export async function getSocialLinks(): Promise<SiteSocialLinks> {
  ensureDevContentFresh();
  const filePath = path.join(ROOT, 'pages', 'social.md');
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      console.warn('[content] content/pages/social.md not found — no social icons will render');
      return {};
    }
    throw err;
  }

  const { data } = matter(raw);
  const result = SocialLinksFrontmatter.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid content/pages/social.md — ${message}`);
  }
  return result.data;
}

export type RegistrationConfig = RegistrationConfigFrontmatter & {
  body: string;
  bodyHtml: string;
};

export async function getRegistrationConfig(): Promise<RegistrationConfig> {
  ensureDevContentFresh();
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'registration.md'), 'utf8');
    const { data, content } = matter(raw);
    const parsed = RegistrationConfigFrontmatter.parse(data);
    const body = content.trim();
    return {
      ...parsed,
      body,
      bodyHtml: body ? await renderMarkdown(body) : '',
    };
  } catch {
    return {
      startDate: '',
      open: false,
      phase: 'upcoming',
      timezone: 'Asia/Kolkata',
      eyebrow: 'Register',
      title: 'Reserve your seat',
      description: '',
      body: '',
      bodyHtml: '',
    };
  }
}

