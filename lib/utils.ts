import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** True for absolute http(s) URLs (e.g. Sessionize, KonfHub). */
export function isExternalHref(href?: string): boolean {
  return typeof href === 'string' && /^https?:\/\//i.test(href);
}

/** `target` / `rel` for partner links that should open in a new tab. */
export function externalLinkProps(href?: string): { target?: '_blank'; rel?: string } {
  if (!isExternalHref(href)) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}

export function formatEventDate(input: string | Date | null | undefined, locale = 'en-IN') {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(d);
}

export function formatTime(input: string | Date | null | undefined, locale = 'en-IN') {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(d);
}

export function siteUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return new URL(path, base).toString();
}

const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/** Calendar date (YYYY-MM-DD) in the given IANA timezone. */
export function calendarDateInTimezone(now = new Date(), timeZone = DEFAULT_TIMEZONE): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** True when `today` (in Asia/Kolkata) is on or after `startDate` (inclusive). */
export function isOnOrAfterDate(
  startDate: string,
  now = new Date(),
  timeZone = DEFAULT_TIMEZONE,
): boolean {
  const today = calendarDateInTimezone(now, timeZone);
  return today >= startDate;
}

/** Registration open from startDate; optional endDate closes the window (inclusive). */
export function isRegistrationWindowActive(
  startDate: string,
  endDate?: string,
  options: DateTimeWindowOptions = {},
): boolean {
  const { startTime = '00:00', endTime = '23:59', now = new Date(), timeZone = DEFAULT_TIMEZONE } =
    options;
  const nowMs = now.getTime();
  const startMs = zonedDateTimeToMs(startDate, startTime, timeZone);
  if (nowMs < startMs) return false;
  if (!endDate) return true;
  return nowMs <= zonedDateTimeEndMs(endDate, endTime, timeZone);
}

/** True when `today` (in Asia/Kolkata) falls on or between start/end (inclusive). */
export function isDateRangeActive(
  startDate: string,
  endDate: string,
  now = new Date(),
  timeZone = DEFAULT_TIMEZONE,
): boolean {
  return isDateTimeRangeActive(startDate, endDate, { now, timeZone });
}

export type DateTimeWindowOptions = {
  /** 24h `HH:mm` in `timeZone`. Defaults to start of day. */
  startTime?: string;
  /** 24h `HH:mm` in `timeZone`. Defaults to end of day (`23:59` inclusive). */
  endTime?: string;
  now?: Date;
  timeZone?: string;
};

/** Wall-clock instant (ms) for `date` + `time` in an IANA timezone. */
export function zonedDateTimeToMs(
  date: string,
  time: string,
  timeZone = DEFAULT_TIMEZONE,
): number {
  const [y, mo, d] = date.split('-').map((n) => Number(n));
  const [h, mi] = time.split(':').map((n) => Number(n));
  if ([y, mo, d, h, mi].some((n) => Number.isNaN(n))) return NaN;

  const utcWall = Date.UTC(y, mo - 1, d, h, mi, 0, 0);
  const probe = new Date(utcWall);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(probe);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const displayed = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );

  return utcWall - (displayed - utcWall);
}

/** End of the `time` minute (inclusive) for window comparisons. */
export function zonedDateTimeEndMs(
  date: string,
  time: string,
  timeZone = DEFAULT_TIMEZONE,
): number {
  return zonedDateTimeToMs(date, time, timeZone) + 59_999;
}

/** True when `now` is within the inclusive start/end window (date + optional time of day). */
export function isDateTimeRangeActive(
  startDate: string,
  endDate: string,
  options: DateTimeWindowOptions = {},
): boolean {
  const { startTime = '00:00', endTime = '23:59', now = new Date(), timeZone = DEFAULT_TIMEZONE } =
    options;
  const startMs = zonedDateTimeToMs(startDate, startTime, timeZone);
  const endMs = zonedDateTimeEndMs(endDate, endTime, timeZone);
  const nowMs = now.getTime();
  return nowMs >= startMs && nowMs <= endMs;
}

export type DateWindowPhase = 'upcoming' | 'open' | 'closed';

/** Whether today is before, within, or after an inclusive start/end window. */
export function getDateWindowPhase(
  startDate: string,
  endDate: string,
  now = new Date(),
  timeZone = DEFAULT_TIMEZONE,
): DateWindowPhase {
  return getDateTimeWindowPhase(startDate, endDate, { now, timeZone });
}

/** Whether `now` is before, within, or after an inclusive start/end window (with optional times). */
export function getDateTimeWindowPhase(
  startDate: string,
  endDate: string,
  options: DateTimeWindowOptions = {},
): DateWindowPhase {
  const { startTime = '00:00', endTime = '23:59', now = new Date(), timeZone = DEFAULT_TIMEZONE } =
    options;
  const nowMs = now.getTime();
  const startMs = zonedDateTimeToMs(startDate, startTime, timeZone);
  const endMs = zonedDateTimeEndMs(endDate, endTime, timeZone);
  if (nowMs < startMs) return 'upcoming';
  if (nowMs > endMs) return 'closed';
  return 'open';
}

/** Registration window with optional end (no end means open-ended after start). */
export function getRegistrationWindowPhase(
  startDate: string,
  endDate?: string,
  options: DateTimeWindowOptions = {},
): DateWindowPhase {
  if (!startDate) return 'upcoming';
  const { startTime = '00:00', endTime = '23:59', now = new Date(), timeZone = DEFAULT_TIMEZONE } =
    options;
  const nowMs = now.getTime();
  const startMs = zonedDateTimeToMs(startDate, startTime, timeZone);
  if (nowMs < startMs) return 'upcoming';
  if (!endDate) return 'open';
  if (nowMs > zonedDateTimeEndMs(endDate, endTime, timeZone)) return 'closed';
  return 'open';
}

/** Human-readable date, or date + time when `time` is set (Asia/Kolkata by default). */
export function formatWindowMoment(
  date: string,
  time?: string,
  locale = 'en-IN',
  timeZone = DEFAULT_TIMEZONE,
): string {
  if (!time) return formatEventDate(date, locale);
  const ms = zonedDateTimeToMs(date, time, timeZone);
  if (Number.isNaN(ms)) return formatEventDate(date, locale);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(new Date(ms));
}
