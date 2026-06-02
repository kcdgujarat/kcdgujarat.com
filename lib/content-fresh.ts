import { unstable_noStore as noStore } from 'next/cache';
import { CONTENT_REVISION } from './content-revision';

/** In dev: skip RSC cache and tie loaders to the content revision module for HMR. */
export function ensureDevContentFresh(): void {
  if (process.env.NODE_ENV !== 'development') return;
  void CONTENT_REVISION;
  noStore();
}
