import en from '../messages/en.json';
import gu from '../messages/gu.json';

export type Locale = 'en' | 'gu';
export const DEFAULT_LOCALE: Locale = 'en';

const dicts = { en, gu } as const;

export function getMessages(locale: Locale = DEFAULT_LOCALE) {
  return dicts[locale] ?? dicts.en;
}

export function t(locale: Locale, key: string, fallback?: string): string {
  const parts = key.split('.');
  let cur: any = dicts[locale] ?? dicts.en;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return fallback ?? lookupEnglish(key) ?? key;
  }
  return typeof cur === 'string' ? cur : fallback ?? key;
}

function lookupEnglish(key: string): string | undefined {
  const parts = key.split('.');
  let cur: any = dicts.en;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return undefined;
  }
  return typeof cur === 'string' ? cur : undefined;
}
