/**
 * Minimal RFC 5545 generator — enough for a single VEVENT, no recurrence and
 * no timezone definitions. All instants are emitted as UTC (`Z`), which every
 * calendar client resolves back to the reader's own zone, so we never have to
 * ship a VTIMEZONE block for Asia/Kolkata.
 */

export type IcsEvent = {
  /** Stable across regenerations — calendars use it to update rather than duplicate. */
  uid: string;
  start: Date;
  end: Date;
  title: string;
  description?: string;
  location?: string;
  url?: string;
};

/** `20260919T020000Z` */
function toIcsUtc(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

/** Escape per RFC 5545 §3.3.11 — backslash first so we don't double-escape. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Fold to 75 octets per line (§3.1). Counts UTF-8 bytes, not characters, so a
 * session title with an em dash or a Gujarati name can't push a line over the
 * limit and break parsing in stricter clients.
 */
function fold(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const out: string[] = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    // Continuation lines carry a leading space, so their budget is one smaller.
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      out.push(current);
      current = '';
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  if (current) out.push(current);
  return out.map((l, i) => (i === 0 ? l : ` ${l}`)).join('\r\n');
}

export function buildIcs(events: IcsEvent[], stamp = new Date()): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KCD Gujarat//kcdgujarat.com//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const e of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid}`,
      `DTSTAMP:${toIcsUtc(stamp)}`,
      `DTSTART:${toIcsUtc(e.start)}`,
      `DTEND:${toIcsUtc(e.end)}`,
      `SUMMARY:${escapeText(e.title)}`,
    );
    if (e.description) lines.push(`DESCRIPTION:${escapeText(e.description)}`);
    if (e.location) lines.push(`LOCATION:${escapeText(e.location)}`);
    if (e.url) lines.push(`URL:${e.url}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  // RFC 5545 requires CRLF, and a trailing one after the final line.
  return `${lines.map(fold).join('\r\n')}\r\n`;
}

/** `text/calendar` response headers, with a filename for the download. */
export function icsHeaders(filename: string): HeadersInit {
  return {
    'Content-Type': 'text/calendar; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'public, max-age=3600',
  };
}
