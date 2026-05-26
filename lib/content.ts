import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
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
  const file = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(md);
  return String(file);
}

function slugFromFile(file: string) {
  return file.replace(/\.(md|mdx)$/, '');
}

export type Speaker = SpeakerFrontmatter & {
  slug: string;
  bio: string;
  bioHtml: string;
  photoUrl?: string;
};

export async function getSpeakers(): Promise<Speaker[]> {
  const files = await listMarkdown('speakers');
  const md: Speaker[] = [];
  for (const f of files) {
    if (f.includes('.gu.')) continue;
    const { data, content } = await readMarkdown('speakers', f);
    const parsed = SpeakerFrontmatter.parse(data);
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
    bio: p.bio || '',
    bioHtml: p.bio || '',
  }));
  return merged.sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name));
}

export type Session = SessionFrontmatter & {
  slug: string;
  abstract: string;
  abstractHtml: string;
};

export async function getSessions(): Promise<Session[]> {
  const files = await listMarkdown('sessions');
  const md: Session[] = [];
  for (const f of files) {
    if (f.includes('.gu.')) continue;
    const { data, content } = await readMarkdown('sessions', f);
    const parsed = SessionFrontmatter.parse(data);
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
    abstract: p.abstract || '',
    abstractHtml: p.abstract || '',
  }));
  return merged.sort((a, b) => (a.start || '').localeCompare(b.start || ''));
}

export type Sponsor = SponsorFrontmatter & {
  slug: string;
  description: string;
  logoUrl?: string;
};

export async function getSponsors(): Promise<Sponsor[]> {
  const files = await listMarkdown('sponsors');
  const md: Sponsor[] = [];
  for (const f of files) {
    const { data, content } = await readMarkdown('sponsors', f);
    const parsed = SponsorFrontmatter.parse(data);
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
    logo: typeof p.logo === 'object' ? p.logo?.url : undefined,
    logoUrl: typeof p.logo === 'object' ? p.logo?.url : undefined,
    description: p.description || '',
  }));
  return merged.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

export type Faq = FaqFrontmatter & { slug: string; answer: string; answerHtml: string };

export async function getFaqs(): Promise<Faq[]> {
  const files = await listMarkdown('faq');
  const md: Faq[] = [];
  for (const f of files) {
    const { data, content } = await readMarkdown('faq', f);
    const parsed = FaqFrontmatter.parse(data);
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
    answer: p.answer || '',
    answerHtml: p.answer || '',
  }));
  return merged.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}


export type Partner = PartnerFrontmatter & {
  slug: string;
  logoUrl?: string;
};

export async function getPartners(): Promise<Partner[]> {
  const files = await listMarkdown('partners');
  const md: Partner[] = [];
  for (const f of files) {
    if (f.includes('.gu.')) continue;
    const { data } = await readMarkdown('partners', f);
    const parsed = PartnerFrontmatter.parse(data);
    md.push({
      ...parsed,
      slug: slugFromFile(f),
      logoUrl: parsed.logo,
    });
  }
  return md.sort(
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
  const files = await listMarkdown('team');
  const md: TeamMember[] = [];
  for (const f of files) {
    if (f.includes('.gu.')) continue;
    const { data, content } = await readMarkdown('team', f);
    const parsed = TeamFrontmatter.parse(data);
    md.push({
      ...parsed,
      slug: slugFromFile(f),
      bio: content,
      bioHtml: await renderMarkdown(content),
      photoUrl: parsed.photo,
    });
  }
  return md.sort(
    (a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name),
  );
}

export type CfpConfig = CfpConfigFrontmatter;

export async function getCfpConfig(): Promise<CfpConfig> {
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'cfp.md'), 'utf8');
    const { data } = matter(raw);
    return CfpConfigFrontmatter.parse(data);
  } catch {
    return { open: true, showSpeakers: false };
  }
}

export type EventConfig = EventConfigFrontmatter;

export async function getEventConfig(): Promise<EventConfig> {
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'event.md'), 'utf8');
    const { data } = matter(raw);
    return EventConfigFrontmatter.parse(data);
  } catch {
    return { city: 'Gujarat, India' };
  }
}

export type RegistrationConfig = RegistrationConfigFrontmatter;

export async function getRegistrationConfig(): Promise<RegistrationConfig> {
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'registration.md'), 'utf8');
    const { data } = matter(raw);
    return RegistrationConfigFrontmatter.parse(data);
  } catch {
    return { open: false };
  }
}

export type KeyDate = { label: string; value: string };

export async function getKeyDates(): Promise<KeyDate[]> {
  try {
    const raw = await fs.readFile(path.join(ROOT, 'pages', 'key-dates.md'), 'utf8');
    const { data } = matter(raw);
    const parsed = KeyDatesFrontmatter.parse(data);
    return parsed.items;
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
