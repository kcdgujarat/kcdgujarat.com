'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Session } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';

const TRACKS = ['All', 'Platform', 'DevSecOps', 'AI/ML', 'Networking', 'Beginner'] as const;

export function ScheduleGrid({ sessions }: { sessions: Session[] }) {
  const [track, setTrack] = React.useState<(typeof TRACKS)[number]>('All');

  const filtered = track === 'All' ? sessions : sessions.filter((s) => s.track === track);

  const groups = React.useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const s of filtered) {
      const day = s.start ? new Date(s.start).toISOString().slice(0, 10) : 'TBD';
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(s);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div>
      <div role="tablist" aria-label="Filter by track" className="mb-6 flex flex-wrap gap-2">
        {TRACKS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={t === track}
            onClick={() => setTrack(t)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              t === track
                ? 'border-kcd-primary bg-kcd-primary text-white'
                : 'border-kcd-border bg-white text-kcd-ink hover:bg-kcd-subtle',
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-10">
        {groups.length === 0 && (
          <p className="text-kcd-muted">No sessions match this filter yet. Check back soon.</p>
        )}
        {groups.map(([day, items]) => (
          <section key={day}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-kcd-muted">
              {day === 'TBD'
                ? 'Time TBD'
                : new Date(day).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
            </h3>
            <ul className="space-y-3">
              {items.map((s) => (
                <li key={s.slug}>
                  <Link href={`/schedule/${s.slug}`}>
                    <Card>
                      <CardBody className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-kcd-muted">
                            {s.start && <span>{formatTime(s.start)}</span>}
                            {s.room && <span>· {s.room}</span>}
                            {s.durationMinutes && <span>· {s.durationMinutes} min</span>}
                          </div>
                          <h4 className="text-base font-semibold text-kcd-ink">{s.title}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {s.track && <Badge>{s.track}</Badge>}
                          {s.type && <Badge>{s.type}</Badge>}
                          {s.level && <Badge>{s.level}</Badge>}
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
