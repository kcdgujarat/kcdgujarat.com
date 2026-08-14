import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ScheduleGrid } from '@/components/site/ScheduleGrid';
import { getSessions, getSpeakers, getCfpConfig, getEventConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { formatEventDate, formatWindowMoment } from '@/lib/utils';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Schedule',
  path: '/schedule',
  description: 'Multi-track agenda for KCD Gujarat 2026 — keynotes, talks, and lightning sessions.',
});

export default async function SchedulePage() {
  const [sessions, speakers, cfp, event] = await Promise.all([
    getSessions(),
    getSpeakers(),
    getCfpConfig(),
    getEventConfig(),
  ]);
  if (!cfp.showSpeakers) notFound();

  const startLabel = formatWindowMoment(cfp.startDate, cfp.startTime, 'en-IN', cfp.timezone);
  const endLabel = formatWindowMoment(cfp.endDate, cfp.endTime, 'en-IN', cfp.timezone);

  if (cfp.phase === 'open') {
    return (
      <Container className="py-16">
        <SectionHeader
          eyebrow="Schedule"
          title="Schedule + talks drop after CFP closes"
          description="The Call for Proposals is currently open. The full multi-track agenda will be published once the CFP closes and talks are confirmed."
        />
        <div className="rounded-3xl border border-dashed border-kcd-border bg-white p-8 text-center shadow-card md:p-10">
          <p className="font-display text-xl font-semibold text-kcd-ink">CFP is open</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-kcd-ink/70">
            Want your talk on this schedule? Submit
            {endLabel ? ` before ${endLabel}.` : ' while the CFP is open.'}
          </p>
          <Link
            href="/cfp"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-kcd-primary px-7 text-sm font-bold uppercase tracking-wider !text-white"
          >
            Submit a Talk
          </Link>
        </div>
      </Container>
    );
  }

  if (cfp.phase === 'upcoming') {
    return (
      <Container className="py-16">
        <SectionHeader
          eyebrow="Schedule"
          title="Schedule publishes after CFP closes"
          description={
            startLabel
              ? `The CFP opens ${startLabel} and closes ${endLabel}. The agenda will be published once submissions are in and talks are confirmed.`
              : 'The full agenda will be published after the Call for Proposals closes.'
          }
        />
        <div className="rounded-3xl border border-dashed border-kcd-border bg-white p-8 text-center shadow-card md:p-10">
          <p className="text-sm text-kcd-ink/70">
            <Link href="/cfp" className="font-semibold text-kcd-primary underline-offset-4 hover:underline">
              CFP details →
            </Link>
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Schedule"
        title="Sessions and tracks"
        description="Filter by track or hall to find the sessions that match your interests."
      />
      <ScheduleGrid
        sessions={sessions}
        timeline={event.timeline}
        speakers={speakers.map((s) => ({ slug: s.slug, name: s.name }))}
      />
    </Container>
  );
}
