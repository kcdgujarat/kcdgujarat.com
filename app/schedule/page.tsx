import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ScheduleGrid } from '@/components/site/ScheduleGrid';
import { getSessions } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Schedule',
  path: '/schedule',
  description: 'Multi-track agenda for KCD Gujarat 2026 — talks, workshops, and lightning sessions.',
});

export default async function SchedulePage() {
  const sessions = await getSessions();
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
