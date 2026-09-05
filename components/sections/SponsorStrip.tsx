import Link from 'next/link';
import type { Sponsor } from '@/lib/content';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SponsorTier } from '@/components/site/SponsorTier';
import { ButtonLink } from '@/components/ui/button';
import { EVENT_NAME } from '@/lib/brand';

const TIERS: Sponsor['tier'][] = ['platinum', 'gold', 'silver', 'community', 'diversity', 'media'];

export function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  const byTier = (t: Sponsor['tier']) => sponsors.filter((s) => s.tier === t);
  return (
    <section id="sponsors" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Our sponsors"
          title={`Our sponsors make ${EVENT_NAME} happen`}
          description={`We are grateful to the organizations who power ${EVENT_NAME}. Their support brings together the Kubernetes and cloud-native community in Gujarat.`}
          align="center"
        />
        {sponsors.length === 0 && (
          <div className="rounded-3xl border border-dashed border-kcd-border bg-white p-10 text-center">
            <p className="font-display text-xl font-semibold text-kcd-ink">Sponsor slots are open</p>
            <p className="mt-2 text-sm text-kcd-ink/70">
              Be the first to back {EVENT_NAME}. Platinum, Gold, Silver, Bronze, Community and Diversity tiers available.
            </p>
          </div>
        )}
        {TIERS.map((t) => (
          <SponsorTier key={t} tier={t} sponsors={byTier(t)} />
        ))}
        <div className="mt-12 rounded-3xl border border-kcd-border bg-white p-8 text-center shadow-card md:p-10">
          <h3 className="font-display text-2xl font-bold text-kcd-ink sm:text-3xl">
            Want to become a sponsor?
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-base text-kcd-ink/75">
            Join our community of supporters and help make {EVENT_NAME} unforgettable. Multiple sponsorship packages available.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/sponsorship" className="rounded-full">
              View Sponsorship Packages
            </ButtonLink>
            {sponsors.length > 0 && (
              <Link
                href="/sponsors"
                className="text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline"
              >
                All sponsors →
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
