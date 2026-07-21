import Image from 'next/image';
import type { Sponsor } from '@/lib/content';
import { cn } from '@/lib/utils';

const TIER_LABEL: Record<Sponsor['tier'], string> = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  community: 'Community',
  media: 'Media',
};

const TIER_SIZE: Record<Sponsor['tier'], string> = {
  platinum: 'h-20 md:h-24',
  gold: 'h-16 md:h-20',
  silver: 'h-14 md:h-16',
  community: 'h-12 md:h-14',
  media: 'h-12 md:h-14',
};

const TIER_WIDTH: Record<Sponsor['tier'], string> = {
  platinum: 'w-full sm:w-80 md:w-96',
  gold: 'w-full sm:w-64 md:w-72',
  silver: 'w-full sm:w-52 md:w-60',
  community: 'w-full sm:w-44 md:w-48',
  media: 'w-full sm:w-44 md:w-48',
};

export function SponsorTier({ tier, sponsors }: { tier: Sponsor['tier']; sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;
  return (
    <section className="py-8" aria-labelledby={`tier-${tier}`}>
      <h3 id={`tier-${tier}`} className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-kcd-muted">
        {TIER_LABEL[tier]}
      </h3>
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
        {sponsors.map((s) => (
          <a
            key={s.slug}
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              'flex items-center justify-center rounded-xl border border-kcd-border bg-white p-4 transition-shadow hover:shadow-card',
              TIER_WIDTH[tier],
            )}
            aria-label={s.name}
          >
            {s.logoUrl ? (
              <div className={cn('relative w-full', TIER_SIZE[tier])}>
                <Image src={s.logoUrl} alt={s.name} fill className="object-contain" sizes="200px" />
              </div>
            ) : (
              <span className={cn('flex items-center text-base font-semibold text-kcd-ink', TIER_SIZE[tier])}>
                {s.name}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
