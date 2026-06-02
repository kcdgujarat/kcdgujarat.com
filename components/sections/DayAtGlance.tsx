import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { TRACKS } from '@/lib/tracks';
import type { TimelineItem } from '@/lib/schema';

type ScheduleTimelineItem = Pick<TimelineItem, 'time' | 'label' | 'icon'>;

const DEFAULT_TIMELINE: ScheduleTimelineItem[] = [
  { time: '08:00', label: 'Registration & Morning Mixer', icon: '☕' },
  { time: '09:00', label: 'Keynote Sessions', icon: '🎤' },
  { time: '11:00', label: 'Parallel Tracks Begin', icon: '🚀' },
  { time: '13:00', label: 'Lunch Break', icon: '🍽️' },
  { time: '14:00', label: 'Afternoon Parallel Tracks', icon: '⚡' },
  { time: '16:00', label: 'Networking Break', icon: '🤝' },
  { time: '16:30', label: 'Closing Ceremony', icon: '🎉' },
];

interface Props {
  eventDateLabel?: string;
  cfpOpen?: boolean;
  showSpeakers?: boolean;
  timeline?: ScheduleTimelineItem[];
}

export function DayAtGlance({ eventDateLabel = 'Conference Day, 2026', cfpOpen = false, showSpeakers = false, timeline }: Props) {
  const items = timeline && timeline.length > 0 ? timeline : DEFAULT_TIMELINE;
  return (
    <section id="schedule" className="bg-kcd-surface py-20">
      <Container>
        <SectionHeader
          eyebrow={eventDateLabel}
          title="Day at a Glance"
          description={
            cfpOpen
              ? 'Schedule + talks drop after CFP closes. Here is the day shape we are planning.'
              : 'One full day of talks, workshops, and community — across five parallel tracks.'
          }
          align="center"
        />

        {cfpOpen && (
          <div className="mb-8 rounded-3xl border border-dashed border-kcd-border bg-white p-6 text-center text-sm text-kcd-ink/70 md:p-8">
            <p className="font-display text-lg font-semibold text-kcd-ink">CFP is open</p>
            <p className="mt-1">
              Final schedule, talks, and speakers will be announced after the CFP closes.
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Timeline */}
          <div className="rounded-3xl border border-kcd-border bg-white p-6 shadow-card md:p-8">
            <h3 className="font-display text-lg font-semibold text-kcd-ink">Schedule overview</h3>
            <ol className="mt-6 space-y-4">
              {items.map((item) => (
                <li key={item.time} className="flex items-start gap-4">
                  <span className="mt-0.5 inline-flex h-10 w-16 shrink-0 items-center justify-center rounded-full bg-kcd-bg font-display text-sm font-semibold text-kcd-ink">
                    {item.time}
                  </span>
                  <span className="flex flex-1 items-center gap-2 text-base text-kcd-ink">
                    <span aria-hidden>{item.icon}</span>
                    {item.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tracks */}
          <div className="rounded-3xl border border-kcd-border bg-white p-6 shadow-card md:p-8">
            <h3 className="font-display text-lg font-semibold text-kcd-ink">Five parallel tracks</h3>
            <p className="mt-2 text-sm text-kcd-ink/70">Pick your path — switch any time.</p>
            <ul className="mt-6 space-y-3">
              {TRACKS.map((t) => (
                <li key={t.id} className="flex items-center gap-4 rounded-2xl border border-kcd-border/70 p-3">
                  <span className={`inline-flex h-10 w-12 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ${t.color}`}>
                    {t.id}
                  </span>
                  <span className="font-medium text-kcd-ink">{t.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          {showSpeakers && (
            <Link
              href="/schedule"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-kcd-ink px-7 text-sm font-bold uppercase tracking-wider text-kcd-ink hover:bg-kcd-ink hover:!text-white"
            >
              View Full Schedule
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
