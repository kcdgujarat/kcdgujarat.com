import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';

type PayloadInstance = Awaited<ReturnType<typeof getPayload>> | null;

// Singleton init. On failure (e.g. Postgres down in local dev), cache a null
// so we don't retry — and noisily flood the console — on every request.
let initPromise: Promise<PayloadInstance> | null = null;

export async function payload(): Promise<PayloadInstance> {
  if (!initPromise) {
    initPromise = getPayload({ config })
      .then((p) => p as PayloadInstance)
      .catch((err) => {
        // Surface once, then degrade to markdown-only mode.
        // eslint-disable-next-line no-console
        console.warn('[payload] init failed — running in markdown-only mode:', err?.message ?? err);
        return null;
      });
  }
  return initPromise;
}

export async function getSettings() {
  const p = await payload();
  if (!p) return null;
  try {
    return await p.findGlobal({ slug: 'settings', depth: 2 });
  } catch {
    return null;
  }
}
