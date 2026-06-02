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
  KeyDatesFrontmatter,
  SessionFrontmatter,
  SpeakerFrontmatter,
  SponsorFrontmatter,
  TeamFrontmatter,
  PartnerFrontmatter,
  CfpConfigFrontmatter,
  RegistrationConfigFrontmatter,
  EventConfigFrontmatter,
  SponsorshipConfigFrontmatter,
  isPublished,
} from './schema';
import { payload } from './payload';

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
  const fromPayload = await safePayloadList('speakers');
  const merged = mergeBySlug(md, fromPayload, (p) => ({
    slug: p.slug,
    name: p.name,
    role: p.role || '',
    company: p.company || '',
    photo: typeof p.photo === 'object' ? p.photo?.url : undefined,
    photoUrl: typeof p.photo === 'object' ? p.photo?.url : undefined,
    socials: p.socials || {},
    sessions: [],
    featured: !!p.featured,
    order: p.order ?? 100,
    render: p.render ?? true,
    bio: p.bio || '',
    bioHtml: p.bio || '',
  }));
  return publishedOnly(merged).sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name));
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
  const fromPayload = await safePayloadList('sessions');
  const merged = mergeBySlug(md, fromPayload, (p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type || 'Talk',
    track: p.track,
    durationMinutes: p.durationMinutes ?? 30,
    start: p.start,
    room: p.room,
    level: p.level,
    speakers: (p.speakers || []).map((s: any) => (typeof s === 'object' ? s.slug : s)),
    tags: (p.tags || []).map((t: any) => (typeof t === 'object' ? t.tag : t)),
    render: p.render ?? true,
    abstract: p.abstract || '',
    abstractHtml: p.abstract || '',
  }));
  return publishedOnly(merged).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
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
  const fromPayload = await safePayloadList('sponsors');
  const merged = mergeBySlug(md, fromPayload, (p) => ({
    slug: p.slug,
    name: p.name,
    tier: p.tier,
    url: p.url,
    order: p.order ?? 100,
    render: p.render ?? true,
    logo: typeof p.logo === 'object' ? p.logo?.url : undefined,
    logoUrl: typeof p.logo === 'object' ? p.logo?.url : undefined,
    description: p.description || '',
  }));
  return publishedOnly(merged).sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
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
  const fromPayload = await safePayloadList('faqs');
  const merged = mergeBySlug(md, fromPayload, (p) => ({
    slug: p.slug,
    question: p.question,
    order: p.order ?? 100,
    render: p.render ?? true,
    answer: p.answer || '',
    answerHtml: p.answer || '',
  }));
  return publishedOnly(merged).sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
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
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'cfp.md'), 'utf8');
    const { data, content } = matter(raw);
    const parsed = CfpConfigFrontmatter.parse(data);
    const body = content.trim();
    return {
      ...parsed,
      body,
      bodyHtml: body ? await renderMarkdown(body) : '',
    };
  } catch {
    return {
      startDate: '',
      endDate: '',
      open: false,
      phase: 'upcoming' as const,
      deadline: '',
      showSpeakers: false,
      eyebrow: 'CFP',
      title: 'Call for Proposals',
      description: '',
      body: '',
      bodyHtml: '',
    };
  }
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
    return { city: 'Gujarat, India' };
  }
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
      eyebrow: 'Register',
      title: 'Reserve your seat',
      description: '',
      body: '',
      bodyHtml: '',
    };
  }
}

export type KeyDate = { label: string; value: string };

export async function getKeyDates(): Promise<KeyDate[]> {
  ensureDevContentFresh();
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'key-dates.md'), 'utf8');
    const { data } = matter(raw);
    const parsed = KeyDatesFrontmatter.parse(data);
    return publishedOnly(parsed.items).map(({ label, value }) => ({ label, value }));
  } catch {
    return [];
  }
}

async function safePayloadList(collection: string): Promise<any[]> {
  try {
    const p = await payload();
    if (!p) return [];
    const res = await p.find({ collection: collection as any, limit: 500, depth: 1 });
    return res.docs as any[];
  } catch {
    return [];
  }
}

function mergeBySlug<T extends { slug: string }>(
  md: T[],
  cms: any[],
  fromCms: (doc: any) => T,
): T[] {
  const bySlug = new Map<string, T>();
  for (const doc of cms) {
    if (!doc?.slug) continue;
    bySlug.set(doc.slug, fromCms(doc));
  }
  for (const item of md) {
    bySlug.set(item.slug, { ...bySlug.get(item.slug), ...item });
  }
  return Array.from(bySlug.values());
}
