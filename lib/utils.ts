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
