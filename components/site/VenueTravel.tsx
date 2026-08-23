import { Bus, Car, Plane, Train, TramFront, type LucideIcon } from 'lucide-react';
import type { VenueTravelIcon, VenueTravelItem } from '@/lib/schema';

const TRAVEL_ICONS: Record<VenueTravelIcon, LucideIcon> = {
  plane: Plane,
  bus: Bus,
  train: Train,
  car: Car,
  metro: TramFront,
};

/** Drop hidden rows and apply the frontmatter `order`. */
export function orderVenueTravel(items: VenueTravelItem[]): VenueTravelItem[] {
  return items.filter((i) => i.render).sort((a, b) => a.order - b.order);
}

/**
 * "How far is it from…" list. Distances are road figures, so both the km and
 * the minutes are printed as approximate — the alternative is a precise number
 * that is wrong at every hour except the one it was measured in.
 */
export function VenueTravelList({
  items,
  showNotes = true,
  className,
}: {
  items: VenueTravelItem[];
  /** Homepage hides the notes; `/venue` has the room for them. */
  showNotes?: boolean;
  className?: string;
}) {
  const rows = orderVenueTravel(items);
  if (rows.length === 0) return null;

  return (
    <ul className={className}>
      {rows.map((item) => {
        const Icon = TRAVEL_ICONS[item.icon];
        return (
          <li
            key={item.from}
            className="flex gap-4 rounded-2xl border border-kcd-border bg-white p-5 shadow-card"
          >
            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-kcd-primary" aria-hidden />
            <div className="min-w-0">
              <p className="font-semibold text-kcd-ink">{item.from}</p>
              <p className="mt-1 text-sm text-kcd-muted">
                {/* The tilde is decorative — "about" carries the meaning for a
                    screen reader, which would otherwise read it as a squiggle
                    or skip it entirely. */}
                <span aria-hidden>~</span>
                <span className="sr-only">about </span>
                {item.distanceKm} km by road
                {item.driveMinutes
                  ? ` · allow about ${item.driveMinutes}${
                      item.driveMinutesMax ? `\u2013${item.driveMinutesMax}` : ''
                    } min`
                  : null}
              </p>
              {showNotes && item.note ? (
                <p className="mt-2 text-sm text-kcd-muted">{item.note}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
