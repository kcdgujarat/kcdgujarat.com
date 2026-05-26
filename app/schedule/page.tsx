import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ScheduleGrid } from '@/components/site/ScheduleGrid';
import { getSessions, getCfpConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Schedule',
  path: '/schedule',
  description: 'Multi-track agenda for KCD Gujarat 2026 — talks, workshops, and lightning sessions.',
});

export default async function SchedulePage() {
  const [sessions, cfp] = await Promise.all([getSessions(), getCfpConfig()]);

  if (cfp.open) {
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
            {cfp.deadline ? ` before ${cfp.deadline}.` : ' while the CFP is open.'}
          </p>
          {cfp.url && (
            <Link
              href={cfp.url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-kcd-primary px-7 text-sm font-bold uppercase tracking-wider !text-white"
            >
              Submit a Talk
            </Link>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Schedule"
        title="Sessions and tracks"
        description="Filter by track to find sessions that match your interests."
      />
      <ScheduleGrid sessions={sessions} />
    </Container>
  );
}
