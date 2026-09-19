import type { MetadataRoute } from 'next';
import { getEventConfig } from '@/lib/content';

export const revalidate = 3600;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const event = await getEventConfig();

  return {
    name: 'KCD Gujarat 2026',
    short_name: 'KCD Gujarat',
    description:
      'Kubernetes Community Day Gujarat 2026 — schedule, speakers, venue and travel for the event.',
    // Standalone so attendees can keep the schedule one tap away on the day.
    start_url: '/schedule',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    // Matches `--kcd-bg` cream and the navy chrome, so the splash doesn't flash white.
    background_color: '#F6F4ED',
    theme_color: '#0F172A',
    lang: 'en',
    categories: ['education', 'events'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Schedule', url: '/schedule' },
      { name: 'Speakers', url: '/speakers' },
      ...(event.showVenue ? [{ name: 'Venue', url: '/venue' }] : []),
    ],
  };
}
