import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  now = new Date(),
  timeZone = DEFAULT_TIMEZONE,
): boolean {
  if (!isOnOrAfterDate(startDate, now, timeZone)) return false;
  if (!endDate) return true;
  return isDateRangeActive(startDate, endDate, now, timeZone);
}

/** True when `today` (in Asia/Kolkata) falls on or between start/end (inclusive). */
export function isDateRangeActive(
  startDate: string,
  endDate: string,
  now = new Date(),
  timeZone = DEFAULT_TIMEZONE,
): boolean {
  const today = calendarDateInTimezone(now, timeZone);
  return today >= startDate && today <= endDate;
}

export type DateWindowPhase = 'upcoming' | 'open' | 'closed';

/** Whether today is before, within, or after an inclusive start/end window. */
export function getDateWindowPhase(
  startDate: string,
  endDate: string,
  now = new Date(),
  timeZone = DEFAULT_TIMEZONE,
): DateWindowPhase {
  const today = calendarDateInTimezone(now, timeZone);
  if (today < startDate) return 'upcoming';
  if (today > endDate) return 'closed';
  return 'open';
}

/** Date window with optional end — registration-style (no end means open-ended after start). */
export function getWindowPhase(
  startDate: string,
  endDate?: string,
  now = new Date(),
  timeZone = DEFAULT_TIMEZONE,
): DateWindowPhase {
  if (!startDate) return 'upcoming';
  if (!endDate) return isOnOrAfterDate(startDate, now, timeZone) ? 'open' : 'upcoming';
  return getDateWindowPhase(startDate, endDate, now, timeZone);
}
