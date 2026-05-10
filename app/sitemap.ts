import type { MetadataRoute } from 'next';
import { getBlogPosts, getSessions, getSpeakers, getSponsors } from '@/lib/content';
import { siteUrl } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [speakers, sessions, sponsors, posts] = await Promise.all([
    getSpeakers(),
    getSessions(),
    getSponsors(),
    getBlogPosts(),
  ]);

  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    '/',
    '/speakers',
    '/schedule',
    '/sponsors',
    '/venue',
    '/cfp',
    '/register',
    '/team',
    '/sponsorship',
    '/code-of-conduct',
    '/faq',
    '/blog',
  ].map((path) => ({ url: siteUrl(path), lastModified: now, changeFrequency: 'weekly', priority: path === '/' ? 1 : 0.7 }));

  return [
    ...staticEntries,
    ...speakers.map((s) => ({ url: siteUrl(`/speakers/${s.slug}`), lastModified: now })),
    ...sessions.map((s) => ({ url: siteUrl(`/schedule/${s.slug}`), lastModified: now })),
    ...sponsors.map((s) => ({ url: siteUrl(`/sponsors`), lastModified: now })),
    ...posts.map((p) => ({
      url: siteUrl(`/blog/${p.slug}`),
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
    })),
  ];
}
