import Link from 'next/link';
import type { Session } from '@/lib/content';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ScheduleGrid } from '@/components/site/ScheduleGrid';

export function SchedulePreview({ sessions }: { sessions: Session[] }) {
  return (
    <section id="schedule" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Schedule"
          title="Sessions and tracks"
          description="A multi-track agenda across Platform, DevSecOps, AI/ML, Networking, and Beginner content."
        />
        {sessions.length === 0 ? (
          <p className="text-kcd-muted">Schedule will be published after the CFP closes.</p>
        ) : (
          <ScheduleGrid sessions={sessions.slice(0, 8)} />
        )}
        <div className="mt-10 text-center">
          <Link
            href="/schedule"
            className="text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline"
          >
            Full schedule →
          </Link>
        </div>
      </Container>
    </section>
  );
}
