'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Session } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { cn, formatEventDate, formatTime } from '@/lib/utils';
import { TRACKS as TRACK_DEFS, TRACK_BY_SCHEMA } from '@/lib/tracks';
import { buildAgenda, scheduleMinutes, type AgendaItem, type TimelineEntry } from '@/lib/schedule';

/** Sentinel for "no filter", shared by both filter groups. */
const ALL = 'All';

const TRACK_OPTIONS = [
  { value: ALL, label: 'All tracks' },
  ...TRACK_DEFS.map((t) => ({ value: t.schema, label: t.label })),
];

/** A card within a slot: a talk, or a hall-specific agenda item beside it. */
type SlotItem = { kind: 'session'; session: Session } | { kind: 'agenda'; item: AgendaItem };
/** Cards sharing a start time — the halls run in parallel. */
type Slot = {
  key: string;
  time: string;
  startMinutes: number;
  /** Kept so an agenda row can be formatted against the right day. */
  start: Date | null;
  items: SlotItem[];
};
type Day = { key: string; label: string; reference: Date | null; slots: Slot[] };
/** A slot, or a venue-wide agenda row. `time` matches the slot format. */
type Row = { kind: 'slot'; slot: Slot } | { kind: 'agenda'; item: AgendaItem; time: string };

const DAY_KEY = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Groups an already start-sorted list into days, then into parallel time slots. */
function groupByDay(sessions: Session[]): Day[] {
  const days = new Map<string, Day>();
  for (const session of sessions) {
    const start = session.start ? new Date(session.start) : null;
    const dayKey = start ? DAY_KEY.format(start) : 'tbd';
    let day = days.get(dayKey);
    if (!day) {
      day = {
        key: dayKey,
        label: start ? formatEventDate(start) : 'Time to be announced',
        reference: start,
        slots: [],
      };
      days.set(dayKey, day);
    }
    const slotKey = start ? String(start.getTime()) : 'tbd';
    let slot = day.slots.find((s) => s.key === slotKey);
    if (!slot) {
      slot = {
        key: slotKey,
        time: start ? formatTime(start) : '',
        startMinutes: start ? scheduleMinutes(start) : Number.MAX_SAFE_INTEGER,
        start,
        items: [],
      };
      day.slots.push(slot);
    }
    slot.items.push({ kind: 'session', session });
  }
  return Array.from(days.values()).sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Places hall-specific agenda items (a sponsor talk, a gathering) into the slot
 * that runs at the same time, so they sit beside the talk in the other hall.
 */
function withRoomItems(day: Day, roomItems: AgendaItem[]): Slot[] {
  // Copy the items array too — mutating the shared slot would duplicate cards on
  // a re-render.
  const slots = day.slots.map((slot) => ({ ...slot, items: [...slot.items] }));
  for (const item of roomItems) {
    let slot = slots.find((s) => s.startMinutes === item.startMinutes);
    if (!slot) {
      slot = {
        key: `agenda-${item.time}`,
        time: sameDayTime(day.reference, item.startMinutes),
        startMinutes: item.startMinutes,
        start: day.reference,
        items: [],
      };
      slots.push(slot);
    }
    // A hall can only hold one thing at a time; a talk already there wins.
    if (slot.items.some((existing) => roomOf(existing) === item.room)) continue;
    slot.items.push({ kind: 'agenda', item });
  }
  // Order every slot by hall so a hall keeps the same column down the page.
  return slots
    .map((slot) => ({ ...slot, items: [...slot.items].sort(byRoom) }))
    .sort((a, b) => a.startMinutes - b.startMinutes);
}

function roomOf(item: SlotItem): string {
  return (item.kind === 'session' ? item.session.room : item.item.room) ?? '';
}

function byRoom(a: SlotItem, b: SlotItem): number {
  return roomOf(a).localeCompare(roomOf(b));
}

/**
 * Interleaves the venue-wide agenda rows with the slots by time. Unfiltered, the
 * whole day shows. Filtered to one track, only the rows that fall between the
 * talks still on screen survive — so a three-talk track doesn't open with
 * registration and close with the vote of thanks.
 */
function withAgendaRows(
  slots: Slot[],
  rows: AgendaItem[],
  filtered: boolean,
  reference: Date | null,
): Row[] {
  const first = slots[0];
  const last = slots[slots.length - 1];
  const visible =
    !filtered || !first || !last
      ? rows
      : rows.filter(
          (row) => row.startMinutes >= first.startMinutes && row.endMinutes <= last.startMinutes,
        );

  const merged: (Row & { sort: number })[] = [
    ...slots.map((slot) => ({ kind: 'slot' as const, slot, sort: slot.startMinutes })),
    ...visible.map((item) => ({
      kind: 'agenda' as const,
      item,
      time: sameDayTime(reference, item.startMinutes),
      sort: item.startMinutes,
    })),
  ].sort((a, b) => a.sort - b.sort || (a.kind === 'slot' ? -1 : 1));

  return merged.map(({ sort: _sort, ...row }) => row);
}

/**
 * Renders minutes-since-IST-midnight in the same 12-hour format as a slot, by
 * anchoring to a session on that day rather than re-implementing formatTime.
 */
function sameDayTime(reference: Date | null, minutes: number): string {
  if (!reference) return '';
  const istMidnight = reference.getTime() - scheduleMinutes(reference) * 60_000;
  return formatTime(new Date(istMidnight + minutes * 60_000));
}

export function ScheduleGrid({
  sessions,
  timeline,
}: {
  sessions: Session[];
  /** Non-session agenda from `content/pages/event.md`. */
  timeline?: TimelineEntry[];
}) {
  const [track, setTrack] = React.useState(ALL);
  const [hall, setHall] = React.useState(ALL);
  const byTrack = track !== ALL;
  const byHall = hall !== ALL;
  const agenda = React.useMemo(() => buildAgenda(timeline), [timeline]);

  // Halls come from the content, so a third room needs no code change.
  const hallOptions = React.useMemo(() => {
    const names = new Set<string>();
    for (const session of sessions) if (session.room) names.add(session.room);
    for (const item of agenda.roomItems) if (item.room) names.add(item.room);
    return [
      { value: ALL, label: 'All halls' },
      ...Array.from(names)
        .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
        .map((name) => ({ value: name, label: name })),
    ];
  }, [sessions, agenda]);

  const days = React.useMemo(
    () =>
      groupByDay(
        sessions.filter((s) => (!byTrack || s.track === track) && (!byHall || s.room === hall)),
      ),
    [sessions, track, hall, byTrack, byHall],
  );
  // Agenda placeholders belong to no track, so a track filter drops them; a hall
  // filter only narrows them to that hall.
  const roomItems = React.useMemo(
    () => (byTrack ? [] : agenda.roomItems.filter((item) => !byHall || item.room === hall)),
    [agenda, hall, byTrack, byHall],
  );
  const rendered = React.useMemo(
    () =>
      days.map((day) => {
        const slots = withRoomItems(day, roomItems);
        return {
          day,
          rows: withAgendaRows(slots, agenda.rows, byTrack || byHall, day.reference),
        };
      }),
    [days, agenda, roomItems, byTrack, byHall],
  );

  return (
    <div>
      <div className="mb-8 space-y-3">
        <FilterChips
          id="schedule-filter-track"
          label="Track"
          options={TRACK_OPTIONS}
          active={track}
          onChange={setTrack}
        />
        {/* One hall plus the "all" option means there is nothing to choose. */}
        {hallOptions.length > 2 && (
          <FilterChips
            id="schedule-filter-hall"
            label="Hall"
            options={hallOptions}
            active={hall}
            onChange={setHall}
          />
        )}
      </div>
      <div className="space-y-12">
        {days.length === 0 && <p className="text-kcd-muted">{emptyMessage(byTrack, byHall)}</p>}
        {rendered.map(({ day, rows }) => (
          <section key={day.key}>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-kcd-muted">
              {day.label}
            </h3>
            <ol className="space-y-8">
              {rows.map((row) =>
                row.kind === 'agenda' ? (
                  <li key={`agenda-${row.item.time}`}>
                    <AgendaRow item={row.item} time={row.time} />
                  </li>
                ) : (
                  <li key={row.slot.key}>
                    <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="font-display text-lg font-bold text-kcd-ink">
                        {row.slot.time}
                      </h4>
                      {row.slot.items.length > 1 && (
                        <span className="text-xs uppercase tracking-wider text-kcd-muted">
                          {slotLabel(row.slot.items)}
                        </span>
                      )}
                    </div>
                    <ul
                      className={cn(
                        'grid gap-3',
                        row.slot.items.length > 1 && 'md:grid-cols-2 md:items-stretch',
                      )}
                    >
                      {row.slot.items.map((item) => (
                        <li
                          key={
                            item.kind === 'session' ? item.session.slug : `agenda-${item.item.time}`
                          }
                        >
                          {item.kind === 'session' ? (
                            <SessionRow session={item.session} />
                          ) : (
                            <AgendaCard item={item.item} />
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ),
              )}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function FilterChips({
  id,
  label,
  options,
  active,
  onChange,
}: {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span id={id} className="text-xs font-semibold uppercase tracking-wider text-kcd-muted">
        {label}
      </span>
      <div role="group" aria-labelledby={id} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              option.value === active
                ? 'border-kcd-primary bg-kcd-primary text-white'
                : 'border-kcd-border bg-white text-kcd-ink hover:bg-kcd-subtle',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function emptyMessage(byTrack: boolean, byHall: boolean): string {
  if (byTrack && byHall) return 'No sessions on this track in this hall. Try another combination.';
  if (byHall) return 'No sessions in this hall yet.';
  return 'No sessions on this track yet. Try another track.';
}

/**
 * Parallel-slot caption. The 16:30 block onwards is all lightning talks (plus
 * the occasional reserved lightning placeholder), so those rows say so instead
 * of the generic "sessions".
 */
function slotLabel(items: SlotItem[]): string {
  const sessions = items.filter(
    (item): item is Extract<SlotItem, { kind: 'session' }> => item.kind === 'session',
  );
  const lightning =
    sessions.length > 0 && sessions.every((item) => item.session.type === 'Lightning');
  return `${items.length} parallel ${lightning ? 'lightning talks' : 'sessions'}`;
}

function AgendaRow({ item, time }: { item: AgendaItem; time: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed border-kcd-border bg-kcd-subtle/50 px-6 py-4">
      <span className="font-display text-lg font-bold text-kcd-ink">{time}</span>
      <span className="text-base font-medium text-kcd-ink">
        <span aria-hidden className="mr-1.5">
          {item.icon}
        </span>
        {item.label}
      </span>
      {item.durationMinutes > 0 && (
        <span className="text-xs text-kcd-muted">· {item.durationMinutes} min</span>
      )}
    </div>
  );
}

/** A hall-specific agenda item, card-shaped so it lines up with the talk beside it. */
function AgendaCard({ item }: { item: AgendaItem }) {
  return (
    <Card className="h-full border-dashed bg-kcd-subtle/50">
      <CardBody className="flex h-full flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-kcd-muted">
          {item.room && <span className="font-semibold text-kcd-ink">{item.room}</span>}
          {item.durationMinutes > 0 && <span>· {item.durationMinutes} min</span>}
        </div>
        <h5 className="text-base font-semibold text-kcd-ink">
          <span aria-hidden className="mr-1.5">
            {item.icon}
          </span>
          {item.label}
        </h5>
      </CardBody>
    </Card>
  );
}

function SessionRow({ session }: { session: Session }) {
  const trackDef = session.track ? TRACK_BY_SCHEMA[session.track] : undefined;
  const keynote = session.type === 'Keynote';
  return (
    <Link href={`/schedule/${session.slug}`} className="block h-full">
      <Card className="h-full">
        <CardBody className="flex h-full flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-kcd-muted">
            {session.room && <span className="font-semibold text-kcd-ink">{session.room}</span>}
            {session.durationMinutes && <span>· {session.durationMinutes} min</span>}
            {session.level && <span>· {session.level}</span>}
          </div>
          <h5 className="text-base font-semibold text-kcd-ink">
            {keynote && <span className="text-kcd-primary">[Keynote] </span>}
            {session.title}
          </h5>
          <div className="mt-auto flex flex-wrap gap-2">
            {session.track && (
              <Badge className={cn('border-transparent', trackDef?.color)}>
                {trackDef?.label ?? session.track}
              </Badge>
            )}
            {/* The title already says Keynote; a badge repeating it is noise. */}
            {session.type && !keynote && <Badge>{session.type}</Badge>}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
