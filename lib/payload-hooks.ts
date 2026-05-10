import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload';

async function pingRevalidate(paths: string[]) {
  const base = process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret || paths.length === 0) return;
  await Promise.all(
    paths.map(async (p) => {
      try {
        await fetch(`${base}/api/revalidate?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(p)}`, {
          method: 'POST',
        });
      } catch {
        // best-effort; ISR will still refresh on its own schedule
      }
    }),
  );
}

export function revalidateAfterChange(getPaths: (doc: any) => string[]): CollectionAfterChangeHook {
  return async ({ doc }) => {
    await pingRevalidate(getPaths(doc));
    return doc;
  };
}

export function revalidateAfterChangeGlobal(paths: string[]): GlobalAfterChangeHook {
  return async ({ doc }) => {
    await pingRevalidate(paths);
    return doc;
  };
}
