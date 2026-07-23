import Image from 'next/image';
import type { Sponsor } from '@/lib/content';
import { cn } from '@/lib/utils';

const TIER_LABEL: Record<Sponsor['tier'], string> = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  community: 'Community',
  diversity: 'Diversity',
  media: 'Media',
};

/** Logo height inside a fixed card — keeps boxes uniform while preserving tier prominence. */
const TIER_LOGO: Record<Sponsor['tier'], string> = {
  platinum: 'h-16 md:h-20',
  gold: 'h-14 md:h-16',
  silver: 'h-12 md:h-14',
  community: 'h-10 md:h-12',
  diversity: 'h-10 md:h-12',
  media: 'h-10 md:h-12',
};

const CARD =
  'flex h-28 w-44 shrink-0 items-center justify-center rounded-xl border border-kcd-border bg-white p-4 transition-shadow hover:shadow-card sm:h-32 sm:w-52 md:h-36 md:w-56';

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
            className={CARD}
            aria-label={s.name}
          >
            {s.logoUrl ? (
              <div className={cn('relative w-full', TIER_LOGO[tier])}>
                <Image src={s.logoUrl} alt={s.name} fill className="object-contain" sizes="224px" />
              </div>
            ) : (
              <span className={cn('flex items-center text-center text-sm font-semibold text-kcd-ink', TIER_LOGO[tier])}>
                {s.name}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
