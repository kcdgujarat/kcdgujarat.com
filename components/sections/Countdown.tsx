'use client';

import * as React from 'react';

interface CountdownProps {
  /** ISO instant the event starts (doors open). */
  startsAt: string;
  /** ISO instant the event ends. Between the two the timer reads "Happening now". */
  endsAt?: string | null;
  /**
   * Non-ticking sentence announced in place of the digits, e.g.
   * "KCD Gujarat 2026 starts on Saturday, 19 September 2026 at 7:30 am IST."
   * The visual timer is aria-hidden — a per-second live region is unusable
   * with a screen reader.
   */
  srLabel: string;
  className?: string;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const UNITS = ['Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'] as const;

function splitRemaining(ms: number): number[] {
  const left = Math.max(0, ms);
  return [
    Math.floor(left / WEEK),
    Math.floor((left % WEEK) / DAY),
    Math.floor((left % DAY) / HOUR),
    Math.floor((left % HOUR) / MINUTE),
    Math.floor((left % MINUTE) / SECOND),
  ];
}

type Phase = 'before' | 'during' | 'after';

/**
 * Weeks / days / hours / minutes / seconds until the event starts.
 *
 * The first paint is deliberately value-free: the server has no idea what the
 * visitor's clock says, so it renders sized placeholders and the real numbers
 * arrive on mount. That keeps hydration stable and the layout from shifting.
 */
export function Countdown({ startsAt, endsAt, srLabel, className }: CountdownProps) {
  const startMs = React.useMemo(() => new Date(startsAt).getTime(), [startsAt]);
  const endMs = React.useMemo(
    () => (endsAt ? new Date(endsAt).getTime() : startMs),
    [endsAt, startMs],
  );

  const [state, setState] = React.useState<{ phase: Phase; values: number[] } | null>(null);

  React.useEffect(() => {
    if (Number.isNaN(startMs)) return;

    const tick = () => {
      const now = Date.now();
      if (now >= endMs) return setState({ phase: 'after', values: splitRemaining(0) });
      if (now >= startMs) return setState({ phase: 'during', values: splitRemaining(0) });
      setState({ phase: 'before', values: splitRemaining(startMs - now) });
    };

    tick();
    const id = window.setInterval(tick, SECOND);
    return () => window.clearInterval(id);
  }, [startMs, endMs]);

  if (Number.isNaN(startMs)) return null;
  if (state?.phase === 'after') return null;

  const live = state?.phase === 'during';

  return (
    <div className={className}>
      <p className="sr-only">{live ? 'KCD Gujarat 2026 is happening now.' : srLabel}</p>
      {live ? (
        <p
          aria-hidden
          className="inline-flex items-center gap-2 rounded-full border border-kcd-orange/40 bg-white/70 px-4 py-2 text-sm font-bold uppercase tracking-wider text-kcd-ink"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-kcd-orange" />
          Happening now
        </p>
      ) : (
        <ul aria-hidden className="flex flex-wrap items-start gap-2 sm:gap-3">
          {UNITS.map((unit, i) => (
            <li key={unit} className="flex w-12 flex-col items-center gap-1.5 md:w-16">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white/70 font-display text-base font-bold tabular-nums text-kcd-ink md:h-16 md:w-16 md:text-xl ${
                  i % 2 === 0 ? 'border-kcd-primary/60' : 'border-kcd-orange/60'
                }`}
              >
                {state ? state.values[i] : '–'}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-kcd-ink/70 md:text-xs">
                {unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
