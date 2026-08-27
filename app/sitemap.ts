import type { MetadataRoute } from 'next';
import { getSessions, getSpeakers, getSponsors, getCfpConfig, getEventConfig } from '@/lib/content';
import { siteUrl } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [speakers, sessions, sponsors, cfp, event] = await Promise.all([
    getSpeakers(),
    getSessions(),
    getSponsors(),
    getCfpConfig(),
    getEventConfig(),
  ]);

  const now = new Date();
  // `/register` is a next.config redirect to the ticketing partner, not a page — keep it out.
  const staticPaths = [
    '/',
    '/sponsors',
    '/cfp',
    '/sponsorship',
    '/code-of-conduct',
    '/faq',
    '/badge',
  ];
  // `/venue` 404s while the flag is off — don't advertise it to crawlers.
  if (event.showVenue) {
    staticPaths.push('/venue');
  }
  if (cfp.showSpeakers && cfp.phase === 'closed') {
    staticPaths.push('/speakers', '/schedule');
  }
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: siteUrl(path),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  if (cfp.phase !== 'closed' || !cfp.showSpeakers) {
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
