import { Check } from 'lucide-react';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { getSponsorshipConfig, getEventConfig } from '@/lib/content';
import { EVENT_NAME } from '@/lib/brand';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Sponsorship',
  path: '/sponsorship',
  description: `Sponsor ${EVENT_NAME} — why sponsor, who you reach, tiers, benefits, and how to get in touch.`,
});

const DEFAULT_INTRO =
  `${EVENT_NAME} brings the cloud native community of Gujarat and western India together for a community-driven, CNCF-backed day of talks and connection. Sponsoring puts your brand in front of a highly engaged, technical audience — and directly fuels the growth of open source and cloud native across the region.`;

const FALLBACK_TIERS = [
  { name: 'Platinum', slug: 'platinum', price: 'priority placement', group: 'package', perks: ['Stage presence', 'Premium booth', 'Logo on stage backdrop'] },
  { name: 'Gold', slug: 'gold', price: 'standard placement', group: 'package', perks: ['Booth space', 'Logo on website + lanyard'] },
  { name: 'Silver', slug: 'silver', price: 'community tier', group: 'package', perks: ['Logo on website', 'Recognition during opening'] },
  { name: 'Community', slug: 'community', price: 'in-kind', group: 'additional', perks: ['Booth or signage', 'Cross-promotion'] },
  { name: 'Diversity', slug: 'diversity', price: 'in-kind', group: 'additional', perks: ['Booth or signage', 'Cross-promotion'] },
  { name: 'Media', slug: 'media', price: 'in-kind', group: 'additional', perks: ['Logo on website', 'Cross-promotion'] },
] as const;

type Tier = { name: string; slug: string; price?: string; perks: readonly string[] };

function TierCard({ tier }: { tier: Tier }) {
  const [priceMain, priceRest] = tier.price ? tier.price.split(/\s*\(/, 2) : [];
  const priceSub = priceRest ? priceRest.replace(/\)\s*$/, '') : undefined;
  return (
    <Card className="flex h-full flex-col">
      <CardBody className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2">
          <CardTitle>{tier.name}</CardTitle>
          {priceMain && (
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="rounded-full bg-kcd-subtle px-3 py-1 text-sm font-bold uppercase tracking-wide text-kcd-ink">
                {priceMain}
              </span>
              {priceSub && <span className="text-sm font-medium text-kcd-muted">{priceSub}</span>}
            </p>
          )}
        </div>
        {tier.perks.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-kcd-ink">
            {tier.perks.map((p) => (
              <li key={p} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-kcd-orange" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl font-bold text-kcd-ink sm:text-3xl">{children}</h2>;
}

export default async function SponsorshipPage() {
  const [event, sponsorship] = await Promise.all([getEventConfig(), getSponsorshipConfig()]);

  const allTiers = sponsorship.tiers.length > 0 ? sponsorship.tiers : FALLBACK_TIERS;
  const packages = allTiers.filter((t) => t.group !== 'additional');
  const additional = allTiers.filter((t) => t.group === 'additional');

  const intro = sponsorship.intro || DEFAULT_INTRO;
  const reasons = sponsorship.reasons ?? [];
  const audience = sponsorship.audience ?? [];
  const deadline = sponsorship.deadline;
  const terms = sponsorship.terms;
  const email = sponsorship.contactEmail || event.contactEmail;
  const prospectusUrl = sponsorship.prospectusUrl;

  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Sponsorship" title={`Partner with ${EVENT_NAME}`} description={intro} />

      {/* Why sponsor */}
      {reasons.length > 0 && (
        <section className="mt-4">
          <SubHeading>Why sponsor?</SubHeading>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <Card key={r.title} className="h-full">
                <CardBody>
                  <span className="mb-3 inline-block h-2 w-8 rounded-full bg-kcd-orange" aria-hidden />
                  <CardTitle className="text-base">{r.title}</CardTitle>
                  {r.description && <CardDescription>{r.description}</CardDescription>}
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Who you'll reach */}
      {audience.length > 0 && (
        <section className="mt-16 overflow-hidden rounded-3xl bg-kcd-navy p-8 text-white md:p-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Who you&apos;ll reach</h2>
          <p className="mt-2 max-w-2xl text-white/70">
            A focused, technical audience from across Gujarat and western India.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {audience.map((a) => (
              <li key={a} className="flex gap-3 text-sm text-white/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-kcd-orange" aria-hidden />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sponsorship packages */}
      <section className="mt-16">
        <SubHeading>Sponsorship packages</SubHeading>
        <p className="mt-2 max-w-2xl text-kcd-muted">
          Headline tiers, in descending order of prominence. Every tier includes branding and on-site presence.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((t) => (
            <TierCard key={t.slug} tier={t} />
          ))}
        </div>
        <p className="mt-4 text-sm text-kcd-muted">
          * INR equivalent is approximate, based on prevailing exchange rates at the time of invoicing.
        </p>
      </section>

      {/* Additional opportunities */}
      {additional.length > 0 && (
        <section className="mt-16">
          <SubHeading>Additional opportunities</SubHeading>
          <p className="mt-2 max-w-2xl text-kcd-muted">
            Targeted and in-kind ways to support the event and stand out.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {additional.map((t) => (
              <TierCard key={t.slug} tier={t} />
            ))}
          </div>
          <p className="mt-4 text-sm text-kcd-muted">
            * INR equivalent is approximate, based on prevailing exchange rates at the time of invoicing.
          </p>
        </section>
      )}

      {/* Get in touch */}
      <div className="mt-16 rounded-3xl border border-kcd-border bg-kcd-subtle p-8 text-center md:p-12">
        <h2 className="font-display text-2xl font-bold text-kcd-ink sm:text-3xl">Ready to partner with us?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-kcd-ink/80">
          Tell us a little about your goals and we&apos;ll match you to the right package. Download the
          prospectus for the full benefit breakdown.
        </p>
        {deadline && <p className="mt-4 text-sm font-semibold text-kcd-ink">{deadline}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {email && (
            <ButtonLink href={`mailto:${email}?subject=Sponsorship%20-%20KCD%20Gujarat%202026`} size="lg" className="rounded-full">
              Email the team
            </ButtonLink>
          )}
          {prospectusUrl && (
            <ButtonLink href={prospectusUrl} size="lg" variant="outline" className="rounded-full" target="_blank" rel="noreferrer">
              Download Prospectus
            </ButtonLink>
          )}
        </div>
      </div>

      {terms && <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-kcd-muted">{terms}</p>}
    </Container>
  );
}
