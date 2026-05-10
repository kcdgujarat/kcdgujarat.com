import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';

let cached: Awaited<ReturnType<typeof getPayload>> | null = null;

export async function payload() {
  if (cached) return cached;
  cached = await getPayload({ config });
  return cached;
}

export async function getSettings() {
  try {
    const p = await payload();
    return await p.findGlobal({ slug: 'settings', depth: 2 });
  } catch {
    return null;
  }
}
