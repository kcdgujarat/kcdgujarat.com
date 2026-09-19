import {
  getCfpConfig,
  getEventConfig,
  getSessions,
  getSpeakers,
  getSponsors,
} from '@/lib/content';
import { formatEventDateRangeShort, siteUrl } from '@/lib/utils';

export const revalidate = 3600;

/**
 * llms.txt — a proposed convention for giving LLM crawlers a curated map of a
 * site. It is not a ratified standard and no major provider has confirmed it
 * reads one, so treat this as cheap insurance rather than a distribution
 * channel. Generated from the same content as the site so it cannot drift.
 */
export async function GET() {
  const [event, cfp, speakers, sessions, sponsors] = await Promise.all([
    getEventConfig(),
    getCfpConfig(),
    getSpeakers(),
    getSessions(),
    getSponsors(),
  ]);

  const when = formatEventDateRangeShort(event.eventDate, event.eventEndDate);
  const lineupPublic = cfp.showSpeakers && cfp.phase === 'closed';

  const out: string[] = [
    '# KCD Gujarat 2026',
    '',
    `> Kubernetes Community Day Gujarat 2026 — a CNCF-supported, community-run cloud native conference${
      when ? ` on ${when}` : ''
    }${event.city ? ` in ${event.city}` : ''}.`,
    '',
  ];

  if (event.showVenue && event.venueName) {
    out.push(`Venue: ${event.venueName}${event.venueAddress ? `, ${event.venueAddress}` : ''}`, '');
  }

  out.push(
    '## Pages',
    '',
    `- [Home](${siteUrl('/')}): event overview, what to expect, organisers`,
    `- [FAQ](${siteUrl('/faq')}): tickets, venue, food, certificates, recordings`,
    `- [Sponsors](${siteUrl('/sponsors')}): ${sponsors.length} organisations supporting the event`,
    `- [Sponsorship](${siteUrl('/sponsorship')}): tiers, benefits and prospectus`,
    `- [Code of Conduct](${siteUrl('/code-of-conduct')}): CNCF community code of conduct`,
    `- [Attendee badge](${siteUrl('/badge')}): generate a shareable "I'm attending" badge`,
  );
  if (event.showVenue) {
    out.push(`- [Venue](${siteUrl('/venue')}): address, travel from airport, bus and metro`);
  }
  if (lineupPublic) {
    out.push(
      `- [Schedule](${siteUrl('/schedule')}): ${sessions.length} sessions across two halls`,
      `- [Speakers](${siteUrl('/speakers')}): ${speakers.length} speakers`,
    );
  }
  out.push('');

  if (lineupPublic) {
    out.push('## Sessions', '');
    for (const s of sessions) {
      out.push(`- [${s.title}](${siteUrl(`/schedule/${s.slug}`)})${s.track ? `: ${s.track}` : ''}`);
    }
    out.push('', '## Speakers', '');
    for (const s of speakers) {
      const role = [s.role, s.company].filter(Boolean).join(', ');
      out.push(`- [${s.name}](${siteUrl(`/speakers/${s.slug}`)})${role ? `: ${role}` : ''}`);
    }
    out.push('');
  }

  return new Response(out.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
