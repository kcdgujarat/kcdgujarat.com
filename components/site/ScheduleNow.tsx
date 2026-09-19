'use client';

import * as React from 'react';
import Link from 'next/link';
import { Radio } from 'lucide-react';
import type { Session } from '@/lib/content';
import { formatTime } from '@/lib/utils';

type Props = {
  sessions: Session[];
  /** Doors open. Nothing renders before this. */
  eventStart?: string;
  /** Event close. Nothing renders after this. */
  eventEnd?: string;
};

type Live = { session: Session; endsAt: Date };

function endOf(session: Session): Date | null {
  if (!session.start) return null;
  const start = new Date(session.start);
  if (Number.isNaN(start.getTime())) return null;
  return new Date(start.getTime() + (session.durationMinutes ?? 30) * 60_000);
}

/** "in 12 min" / "in 1 hr 5 min" — coarse on purpose, this is a glanceable banner. */
function relative(ms: number): string {
  const mins = Math.max(0, Math.round(ms / 60_000));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

const TICK_MS = 30_000;

/** Ticks every 30s. Bucketed so the snapshot is referentially stable between ticks. */
function subscribeToClock(onChange: () => void) {
  const id = setInterval(onChange, TICK_MS);
  return () => clearInterval(id);
}
function clockSnapshot() {
  return Math.floor(Date.now() / TICK_MS);
}
/** The server has no clock, so it renders nothing and the client fills it in. */
function serverClockSnapshot() {
  return null;
}

export function ScheduleNow({ sessions, eventStart, eventEnd }: Props) {
  const tick = React.useSyncExternalStore(subscribeToClock, clockSnapshot, serverClockSnapshot);

  // Null on the server and during hydration, so this renders nothing at all on
  // every day that isn't the event, and never mismatches.
  if (tick === null) return null;
  const now = new Date(tick * TICK_MS);

  const windowStart = eventStart ? new Date(eventStart) : null;
  const windowEnd = eventEnd ? new Date(eventEnd) : null;
  if (windowStart && now < windowStart) return null;
  if (windowEnd && now > windowEnd) return null;

  const live: Live[] = [];
  let next: Session | null = null;

  for (const session of sessions) {
    if (!session.start) continue;
    const start = new Date(session.start);
    const end = endOf(session);
    if (!end || Number.isNaN(start.getTime())) continue;

    if (start <= now && now < end) {
      live.push({ session, endsAt: end });
    } else if (start > now) {
      // `sessions` arrives sorted by start, so the first future one wins.
      if (!next) next = session;
    }
  }

  if (live.length === 0 && !next) return null;

  return (
    <section
      aria-label="Happening now"
      className="mb-10 rounded-3xl border border-kcd-primary/30 bg-white p-5 shadow-card md:p-6"
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-kcd-primary">
        <Radio className="h-4 w-4" aria-hidden />
        {live.length > 0 ? 'On now' : 'Up next'}
      </p>

      {live.length > 0 && (
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {live.map(({ session, endsAt }) => (
            <li key={session.slug} className="rounded-2xl bg-kcd-subtle/60 p-4">
              {session.room && (
                <p className="text-xs font-semibold uppercase tracking-wide text-kcd-ink/70">
                  {session.room}
                </p>
              )}
              <Link
                href={`/schedule/${session.slug}`}
                className="mt-1 block font-display text-base font-bold text-kcd-ink"
              >
                {session.title}
              </Link>
              <p className="mt-1 text-xs text-kcd-ink/70">
                Ends {formatTime(endsAt)} · {relative(endsAt.getTime() - now.getTime())} left
              </p>
            </li>
          ))}
        </ul>
      )}

      {next && (
        <p className="mt-3 text-sm text-kcd-ink/80">
          {live.length > 0 ? 'Up next: ' : ''}
          <Link href={`/schedule/${next.slug}`} className="font-semibold text-kcd-primary hover:underline">
            {next.title}
          </Link>{' '}
          <span className="text-kcd-ink/70">
            at {formatTime(next.start)}
            {next.room ? ` · ${next.room}` : ''} · in{' '}
            {relative(new Date(next.start!).getTime() - now.getTime())}
          </span>
        </p>
      )}
    </section>
  );
}
