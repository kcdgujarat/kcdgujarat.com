import Link from 'next/link';
import type { Sponsor } from '@/lib/content';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SponsorTier } from '@/components/site/SponsorTier';
import { ButtonLink } from '@/components/ui/button';

const TIERS: Sponsor['tier'][] = ['diamond', 'platinum', 'gold', 'silver', 'community', 'media'];

export function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  const byTier = (t: Sponsor['tier']) => sponsors.filter((s) => s.tier === t);
  return (
    <section id="sponsors" className="bg-kcd-subtle py-20">
      <Container>
        <SectionHeader
          eyebrow="Sponsors"
          title="Powered by our community"
          description="We are proudly supported by organizations that believe in the cloud-native community."
          align="center"
        />
        {sponsors.length === 0 && (
          <p className="text-center text-kcd-muted">Sponsor slots are open. Be the first.</p>
        )}
        {TIERS.map((t) => (
          <SponsorTier key={t} tier={t} sponsors={byTier(t)} />
        ))}
        <div className="mt-10 text-center">
          <ButtonLink href="/sponsorship" variant="outline">
            Become a sponsor
          </ButtonLink>
          <Link
            href="/sponsors"
            className="ml-4 text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline"
          >
            All sponsors →
          </Link>
        </div>
      </Container>
    </section>
  );
}
