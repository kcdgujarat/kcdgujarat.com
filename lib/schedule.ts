import type { Session } from '@/lib/content';

/** A row in the homepage "Schedule overview" card. */
export type ScheduleOverviewItem = {
  /** 24-hour HH:mm, Asia/Kolkata. */
  time: string;
  label: string;
  icon: string;
};

/** A non-session agenda row from the `timeline` list in `content/pages/event.md`. */
export type TimelineEntry = {
  /** 24-hour HH:mm, Asia/Kolkata. */
  time: string;
  endTime?: string;
  label: string;
  icon?: string;
  room?: string;
  glance?: boolean;
  render?: boolean;
};

/** A timeline entry resolved to minutes, ready to place against the sessions. */
export type AgendaItem = ScheduleOverviewItem & {
  startMinutes: number;
  /** Equals `startMinutes` for a marker with no length. */
  endMinutes: number;
  durationMinutes: number;
  room?: string;
};

/** Idle minutes between talks that end one block and start the next. */
const BLOCK_GAP_MINUTES = 15;
const DEFAULT_ICON = '📌';

const IST_HHMM = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function istMinutes(date: Date): number {
  const [hours, minutes] = IST_HHMM.format(date).split(':').map(Number);
  return hours * 60 + minutes;
}

function toHhMm(minutes: number): string {
  const clamped = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(clamped / 60)).padStart(2, '0')}:${String(clamped % 60).padStart(2, '0')}`;
}

function fromHhMm(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

/** Minutes since midnight, Asia/Kolkata — the grid and the card must agree on "when". */
export function scheduleMinutes(date: Date): number {
  return istMinutes(date);
}

type Block = {
  startMinutes: number;
  endMinutes: number;
  rooms: Set<string>;
  allLightning: boolean;
  allKeynote: boolean;
};

function toBlocks(sessions: Session[]): Block[] {
  const timed = sessions
    .filter((s) => s.start)
    .map((s) => {
      const startMinutes = istMinutes(new Date(s.start!));
      return {
        startMinutes,
        endMinutes: startMinutes + (s.durationMinutes ?? 0),
        room: s.room,
        isLightning: s.type === 'Lightning',
        isKeynote: s.type === 'Keynote',
      };
    })
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const blocks: Block[] = [];
  for (const session of timed) {
    const current = blocks[blocks.length - 1];
    if (current && session.startMinutes - current.endMinutes < BLOCK_GAP_MINUTES) {
      current.endMinutes = Math.max(current.endMinutes, session.endMinutes);
      if (session.room) current.rooms.add(session.room);
      current.allLightning = current.allLightning && session.isLightning;
      current.allKeynote = current.allKeynote && session.isKeynote;
      continue;
    }
    blocks.push({
      startMinutes: session.startMinutes,
      endMinutes: session.endMinutes,
      rooms: new Set(session.room ? [session.room] : []),
      allLightning: session.isLightning,
      allKeynote: session.isKeynote,
    });
  }
  return blocks;
}

function describe(block: Block): { label: string; icon: string } {
  const rooms = Array.from(block.rooms).sort();
  const where = rooms.length > 0 ? ` — ${rooms.join(' & ')}` : '';
  if (block.allKeynote) return { label: `Keynotes${where}`, icon: '🎤' };
  if (block.allLightning) return { label: `Lightning Talks${where}`, icon: '⚡' };
  if (rooms.length > 1) return { label: `Parallel Tracks${where}`, icon: '🚀' };
  return { label: `Sessions${where}`, icon: '🎯' };
}

function toAgendaItem(entry: TimelineEntry): AgendaItem {
  const startMinutes = fromHhMm(entry.time);
  const endMinutes = entry.endTime ? fromHhMm(entry.endTime) : startMinutes;
  return {
    time: entry.time,
    label: entry.label,
    icon: entry.icon ?? DEFAULT_ICON,
    room: entry.room,
    startMinutes,
    endMinutes,
    durationMinutes: Math.max(0, endMinutes - startMinutes),
  };
}

/**
 * Splits the agenda into the rows that span the venue (registration, breaks,
 * ceremonies) and the items that occupy a single hall while the other hall runs
 * a talk — the latter belong beside that talk, not on a row of their own.
 */
export function buildAgenda(timeline: TimelineEntry[] = []): {
  rows: AgendaItem[];
  roomItems: AgendaItem[];
} {
  const items = timeline
    .filter((entry) => entry.render !== false)
    .map(toAgendaItem)
    .sort((a, b) => a.startMinutes - b.startMinutes);
  return {
    rows: items.filter((item) => !item.room),
    roomItems: items.filter((item) => item.room),
  };
}

/**
 * Builds the "Schedule overview" rows: session blocks derived from
 * `content/sessions` (so the card can never contradict `/schedule`), plus the
 * agenda items from the `timeline` list in `content/pages/event.md`. Talks
 * running back-to-back collapse into one block.
 *
 * Items flagged `glance: false` are left out to keep the card a summary, and an
 * agenda item at the same time as a derived block replaces it, which is how an
 * organiser overrides a generated label.
 */
export function buildScheduleOverview(
  sessions: Session[],
  timeline: TimelineEntry[] = [],
): ScheduleOverviewItem[] {
  const derived = toBlocks(sessions).map((block) => ({
    time: toHhMm(block.startMinutes),
    ...describe(block),
  }));

  const byTime = new Map(derived.map((item) => [item.time, item]));
  for (const entry of timeline) {
    if (entry.render === false || entry.glance === false || entry.room) continue;
    byTime.set(entry.time, {
      time: entry.time,
      label: entry.label,
      icon: entry.icon ?? DEFAULT_ICON,
    });
  }
  return Array.from(byTime.values()).sort((a, b) => a.time.localeCompare(b.time));
}
