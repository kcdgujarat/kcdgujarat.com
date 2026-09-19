import { notFound } from 'next/navigation';
import { getEventConfig } from '@/lib/content';
import { buildIcs, icsHeaders } from '@/lib/ics';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export async function GET() {
  const event = await getEventConfig();
  // `eventDate` is optional in the schema; without it there is nothing to export.
  if (!event.eventDate) notFound();

  const location = event.showVenue
    ? [event.venueName, event.venueAddress].filter(Boolean).join(', ')
    : event.city;

  const ics = buildIcs([
    {
      uid: 'kcd-gujarat-2026@kcdgujarat.com',
      start: new Date(event.eventDate),
      end: new Date(event.eventEndDate || event.eventDate),
      title: 'KCD Gujarat 2026',
      description: `Kubernetes Community Day Gujarat 2026.\n\n${siteUrl('/schedule')}`,
      location,
      url: siteUrl('/'),
    },
  ]);

  return new Response(ics, { headers: icsHeaders('kcd-gujarat-2026.ics') });
}
