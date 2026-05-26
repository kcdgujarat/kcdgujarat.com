import type { MetadataRoute } from 'next';
import { getSessions, getSpeakers, getSponsors, getCfpConfig } from '@/lib/content';
import { siteUrl } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [speakers, sessions, sponsors, cfp] = await Promise.all([
    getSpeakers(),
    getSessions(),
    getSponsors(),
    getCfpConfig(),
  ]);

  const now = new Date();
  const staticPaths = [
    '/',
    '/sponsors',
    '/venue',
    '/cfp',
    '/register',
    '/team',
    '/sponsorship',
    '/code-of-conduct',
    '/faq',
  ];
  if (!cfp.open) {
    staticPaths.push('/speakers', '/schedule');
  }
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: siteUrl(path),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  if (cfp.open) {
    return [
      ...staticEntries,
      ...sponsors.map((s) => ({ url: siteUrl(`/sponsors`), lastModified: now })),
    ];
  }

  return [
    ...staticEntries,
    ...speakers.map((s) => ({ url: siteUrl(`/speakers/${s.slug}`), lastModified: now })),
    ...sessions.map((s) => ({ url: siteUrl(`/schedule/${s.slug}`), lastModified: now })),
    ...sponsors.map((s) => ({ url: siteUrl(`/sponsors`), lastModified: now })),
  ];
}
