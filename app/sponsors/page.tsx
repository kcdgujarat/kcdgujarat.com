import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SponsorTier } from '@/components/site/SponsorTier';
import { ButtonLink } from '@/components/ui/button';
import { getSponsors, type Sponsor } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/utils';

const TIERS: Sponsor['tier'][] = ['platinum', 'gold', 'silver', 'community'];

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Sponsors',
  path: '/sponsors',
  description: 'Organizations powering KCD Gujarat 2026.',
});

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  const byTier = (t: Sponsor['tier']) => sponsors.filter((s) => s.tier === t);
  const orgLd = sponsors.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: s.name,
    url: s.url,
    logo: s.logoUrl,
    sameAs: [s.url],
  }));
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <Container className="py-16">
        <SectionHeader
          eyebrow="Sponsors"
          title="Powered by our community"
          description="A heartfelt thank you to the organizations that make KCD Gujarat possible."
          align="center"
        />
        {sponsors.length === 0 ? (
          <p className="text-center text-kcd-muted">
            Sponsor slots are open. <a href={siteUrl('/sponsorship')} className="text-kcd-primary underline">Become a sponsor</a>.
          </p>
        ) : (
          TIERS.map((t) => <SponsorTier key={t} tier={t} sponsors={byTier(t)} />)
        )}
        <div className="mt-12 text-center">
          <ButtonLink href="/sponsorship" size="lg">
            Become a sponsor
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
