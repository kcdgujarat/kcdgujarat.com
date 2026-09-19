import { notFound } from 'next/navigation';
import { getCfpConfig, getEventConfig, getSessions, getSpeakers } from '@/lib/content';
import { buildIcs, icsHeaders } from '@/lib/ics';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [sessions, speakers, cfp, event] = await Promise.all([
    getSessions(),
    getSpeakers(),
    getCfpConfig(),
    getEventConfig(),
  ]);

  // Same gate as the session page — a session file must not leak before the
  // lineup is public.
  if (!cfp.showSpeakers || cfp.phase === 'open' || cfp.phase === 'upcoming') notFound();

  const session = sessions.find((s) => s.slug === slug);
  if (!session?.start) notFound();

  const start = new Date(session.start);
  const end = new Date(start.getTime() + (session.durationMinutes ?? 30) * 60_000);

  const names = speakers
    .filter((sp) => session.speakers?.includes(sp.slug))
    .map((sp) => sp.name);

  const venue = event.showVenue ? event.venueName : undefined;
  const location = [session.room, venue].filter(Boolean).join(', ') || event.city;

  const description = [
    names.length ? `Speakers: ${names.join(', ')}` : null,
    session.track ? `Track: ${session.track}` : null,
    siteUrl(`/schedule/${session.slug}`),
  ]
    .filter(Boolean)
    .join('\n');

  const ics = buildIcs([
    {
      uid: `session-${session.slug}@kcdgujarat.com`,
      start,
      end,
      title: session.title,
      description,
      location,
      url: siteUrl(`/schedule/${session.slug}`),
    },
  ]);

  return new Response(ics, { headers: icsHeaders(`${session.slug}.ics`) });
}
