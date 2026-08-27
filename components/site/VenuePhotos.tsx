'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import type { VenuePhoto } from '@/lib/schema';

/**
 * Venue photos with a click-to-enlarge lightbox.
 *
 * The hero and the gallery are two separate regions of `/venue` with the map
 * and the "On the day" cards in between, so each owns its own lightbox instance
 * rather than sharing state through a provider that would have to wrap the
 * whole page. Both are handed the *full* photo list and the index they start
 * on, so paging left/right walks every venue photo either way.
 */

/** Panel wide enough for a landscape photo; the top padding clears Dialog's close button. */
const PANEL = 'max-w-5xl p-4 pt-14 sm:p-6 sm:pt-14';

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: VenuePhoto[];
  /** `null` closes the dialog. */
  index: number | null;
  onIndex: (next: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const total = photos.length;

  // Arrow keys page through the set. Escape and Tab are Dialog's job.
  React.useEffect(() => {
    if (!open || total < 2) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      onIndex((index + step + total) % total);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, index, total, onIndex]);

  if (index === null) return null;
  const photo = photos[index];
  if (!photo) return null;

  const titleId = 'venue-photo-title';

  return (
    <Dialog open onClose={onClose} labelledBy={titleId} className={PANEL}>
      {/* With intrinsic dimensions the photo sizes to its own aspect ratio and
          the panel shrinks to fit it — no letterbox bars at any viewport. The
          `fill` branch is the fallback for a photo whose size wasn't recorded. */}
      {photo.width && photo.height ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="mx-auto h-auto max-h-[65vh] w-auto max-w-full rounded-lg"
        />
      ) : (
        <div className="relative h-[50vh] w-full sm:h-[60vh]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-contain"
          />
        </div>
      )}

      <p id={titleId} className="mt-4 text-sm text-kcd-ink">
        {photo.caption || photo.alt}
      </p>

      {total > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <PagerButton
            label="Previous photo"
            onClick={() => onIndex((index - 1 + total) % total)}
            Icon={ChevronLeft}
          />
          {/* aria-live so a screen reader hears the position change without
              having to re-read the whole dialog after every arrow press. */}
          <p aria-live="polite" className="text-sm font-semibold text-kcd-muted">
            {index + 1} of {total}
          </p>
          <PagerButton
            label="Next photo"
            onClick={() => onIndex((index + 1) % total)}
            Icon={ChevronRight}
          />
        </div>
      )}
    </Dialog>
  );
}

function PagerButton({
  label,
  onClick,
  Icon,
}: {
  label: string;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-kcd-border bg-white text-kcd-ink transition-colors hover:bg-kcd-subtle"
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}

/**
 * The trigger. An `<a>` to the image file, not a `<button>`, so the photo is
 * still reachable if JS never arrives — the click handler is the enhancement.
 */
function PhotoTrigger({
  photo,
  onOpen,
  className,
  children,
}: {
  photo: VenuePhoto;
  onOpen: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={photo.src}
      onClick={(e) => {
        // Leave modified clicks alone — cmd/ctrl-click still opens the file.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onOpen();
      }}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
      <span className="sr-only"> — view larger</span>
    </a>
  );
}

/** Badge hinting the photo is clickable. Decorative — the link text says it. */
function ExpandHint() {
  return (
    <span
      className="pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-kcd-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      aria-hidden
    >
      <Expand className="h-4 w-4" />
    </span>
  );
}

export function VenueHeroPhoto({ photos }: { photos: VenuePhoto[] }) {
  const [index, setIndex] = React.useState<number | null>(null);
  const hero = photos[0];
  if (!hero) return null;

  return (
    <>
      <figure className="overflow-hidden rounded-2xl border border-kcd-border shadow-card">
        <PhotoTrigger photo={hero} onOpen={() => setIndex(0)} className="group relative block">
          {/* `fill` + a sized parent. With intrinsic dimensions the frame takes the
              photo's own aspect ratio, so `object-contain` shows the whole building
              with neither a crop nor letterbox bars — the box *is* the photo's shape.
              Without them there is no ratio to match, so the frame keeps a fixed
              height and contain letterboxes rather than cropping. */}
          <span
            className={`relative block w-full bg-kcd-subtle ${
              hero.width && hero.height ? '' : 'h-64 sm:h-80 lg:h-[26rem]'
            }`}
            style={
              hero.width && hero.height
                ? { aspectRatio: `${hero.width} / ${hero.height}` }
                : undefined
            }
          >
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="object-contain"
              priority
            />
          </span>
          <ExpandHint />
        </PhotoTrigger>
        {hero.caption && (
          <figcaption className="bg-white px-5 py-3 text-sm text-kcd-muted">{hero.caption}</figcaption>
        )}
      </figure>
      <Lightbox photos={photos} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}

export function VenuePhotoGrid({
  photos,
  /** Photos to lay out, as a slice of `photos` starting at this offset. */
  offset = 0,
}: {
  photos: VenuePhoto[];
  offset?: number;
}) {
  const [index, setIndex] = React.useState<number | null>(null);
  const shown = photos.slice(offset);
  if (shown.length === 0) return null;

  return (
    <>
      <ul className="grid gap-6 md:grid-cols-2">
        {shown.map((photo, i) => (
          <li
            key={photo.src}
            className="overflow-hidden rounded-2xl border border-kcd-border bg-white shadow-card"
          >
            <figure>
              <PhotoTrigger
                photo={photo}
                onOpen={() => setIndex(offset + i)}
                className="group relative block"
              >
                <span className="relative block h-56 w-full bg-kcd-subtle sm:h-64">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </span>
                <ExpandHint />
              </PhotoTrigger>
              {photo.caption && (
                <figcaption className="px-5 py-3 text-sm text-kcd-muted">{photo.caption}</figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox photos={photos} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
