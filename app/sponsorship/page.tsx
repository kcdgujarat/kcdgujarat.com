import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { getSponsorshipConfig, getEventConfig } from '@/lib/content';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Sponsorship',
  path: '/sponsorship',
  description: 'Sponsor KCD Gujarat 2026 — tiers, benefits, and how to get in touch.',
});

const FALLBACK_TIERS = [
  { name: 'Platinum', slug: 'platinum', price: 'priority placement', perks: ['Workshop slot', 'Premium booth', 'Logo on stage backdrop'] },
  { name: 'Gold', slug: 'gold', price: 'standard placement', perks: ['Booth space', 'Logo on website + lanyard'] },
  { name: 'Silver', slug: 'silver', price: 'community tier', perks: ['Logo on website', 'Recognition during opening'] },
  { name: 'Community', slug: 'community', price: 'in-kind', perks: ['Booth or signage', 'Cross-promotion'] },
  { name: 'Media', slug: 'media', price: 'in-kind', perks: ['Logo on website', 'Cross-promotion'] },
] as const;

export default async function SponsorshipPage() {
  const [event, sponsorship] = await Promise.all([getEventConfig(), getSponsorshipConfig()]);

  const tiers = sponsorship.tiers.length > 0 ? sponsorship.tiers : FALLBACK_TIERS;
  const email = sponsorship.contactEmail || event.contactEmail;
  const prospectusUrl = sponsorship.prospectusUrl;

  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Sponsorship"
        title="Partner with KCD Gujarat 2026"
        description="A community event with high-quality, engaged audiences. We offer multiple tiers — find one that fits your goals."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((t) => (
          <Card key={t.slug}>
            <CardBody>
              <CardTitle>{t.name}</CardTitle>
              {t.price && <CardDescription>{t.price}</CardDescription>}
              {t.perks.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-kcd-ink">
                  {t.perks.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm text-kcd-ink/70">
        *INR equivalent is approximate, based on prevailing exchange rates at the time of invoicing.
      </p>
      <div className="mt-6 rounded-2xl border border-kcd-border bg-kcd-subtle p-8 text-center">
        <p className="text-base text-kcd-ink">Interested in sponsoring? We&apos;d love to talk.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {email && (
            <ButtonLink href={`mailto:${email}?subject=Sponsorship%20-%20KCD%20Gujarat%202026`} className="rounded-full">
              Email the team
            </ButtonLink>
          )}
          {prospectusUrl && (
            <ButtonLink href={prospectusUrl} variant="outline" className="rounded-full" target="_blank" rel="noreferrer">
              Download Prospectus
            </ButtonLink>
          )}
        </div>
      </div>
    </Container>
  );
}
