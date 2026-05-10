import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { getSettings } from '@/lib/payload';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Sponsorship',
  path: '/sponsorship',
  description: 'Sponsor KCD Gujarat 2026 — tiers, benefits, and how to get in touch.',
});

const TIERS = [
  { name: 'Diamond', price: '— top tier —', perks: ['Keynote slot', 'Top placement on all materials', 'Booth premium location', 'Recruitment table'] },
  { name: 'Platinum', price: 'priority placement', perks: ['Workshop slot', 'Premium booth', 'Logo on stage backdrop'] },
  { name: 'Gold', price: 'standard placement', perks: ['Booth space', 'Logo on website + lanyard'] },
  { name: 'Silver', price: 'community tier', perks: ['Logo on website', 'Recognition during opening'] },
  { name: 'Community', price: 'in-kind', perks: ['Booth or signage', 'Cross-promotion'] },
  { name: 'Media', price: 'in-kind', perks: ['Logo on website', 'Cross-promotion'] },
];

export default async function SponsorshipPage() {
  const settings = (await getSettings()) as any;
  const email = settings?.contactEmail;
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Sponsorship"
        title="Partner with KCD Gujarat 2026"
        description="A community event with high-quality, engaged audiences. We offer multiple tiers — find one that fits your goals."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((t) => (
          <Card key={t.name}>
            <CardBody>
              <CardTitle>{t.name}</CardTitle>
              <CardDescription>{t.price}</CardDescription>
              <ul className="mt-4 space-y-1 text-sm text-kcd-ink">
                {t.perks.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="mt-12 rounded-2xl border border-kcd-border bg-kcd-subtle p-8 text-center">
        <p className="text-base text-kcd-ink">Interested in sponsoring? We&apos;d love to talk.</p>
        {email && (
          <ButtonLink href={`mailto:${email}?subject=Sponsorship%20-%20KCD%20Gujarat%202026`} className="mt-4">
            Email the team
          </ButtonLink>
        )}
      </div>
    </Container>
  );
}
