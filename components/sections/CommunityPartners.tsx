import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import type { Partner } from '@/lib/content';

interface Props {
  partners: Partner[];
}

type PartnerType = NonNullable<Partner['type']>;

const GROUPS: { type: PartnerType; eyebrow: string; title: string; description?: string }[] = [
  {
    type: 'community',
    eyebrow: 'Community Partners',
    title: 'Built with our community',
    description:
      'We’re proud to collaborate with organizations that share our passion for cloud-native technologies and community building.',
  },
  {
    type: 'media',
    eyebrow: 'Media Partner',
    title: 'Spreading the word',
    description: 'Helping us reach the cloud-native community far and wide.',
  },
  {
    type: 'venue',
    eyebrow: 'Venue Partner',
    title: 'Where we gather',
    description: 'Hosting KCD Gujarat 2026.',
  },
];

function CommunityPartnerCard({ partner }: { partner: Partner }) {
  const external = partner.url?.startsWith('http');
  const Wrapper: React.ElementType = partner.url ? Link : 'div';
  const wrapperProps = partner.url
    ? { href: partner.url, ...(external ? { target: '_blank', rel: 'noreferrer' } : {}) }
    : {};
  return (
    <Wrapper
      {...wrapperProps}
      className="flex h-full w-full flex-col items-center rounded-3xl border border-kcd-border bg-white p-6 text-center shadow-card transition-shadow hover:shadow-lg"
    >
      {partner.logoUrl ? (
        <div className="relative h-24 w-full">
          <Image
            src={partner.logoUrl}
            alt={`${partner.name} logo`}
            fill
            className="object-contain"
            sizes="200px"
            unoptimized={partner.logoUrl.endsWith('.svg')}
          />
        </div>
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-kcd-primary/10 font-display text-2xl font-bold text-kcd-primary">
          {partner.name
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')}
        </div>
      )}
      <h3 className="mt-4 font-display text-sm font-semibold text-kcd-ink">{partner.name}</h3>
    </Wrapper>
  );
}

export function CommunityPartners({ partners }: Props) {
  if (partners.length === 0) {
    return null;
  }
  const groups = GROUPS.map((g) => ({
    ...g,
    items: partners.filter((p) => (p.type ?? 'community') === g.type),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="partners" className="py-20">
      <Container>
        {groups.map((g, i) => (
          <div key={g.type} className={i > 0 ? 'mt-16' : undefined}>
            <SectionHeader eyebrow={g.eyebrow} title={g.title} description={g.description} align="center" />
            {g.type === 'community' ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {g.items.map((p) => (
                  <CommunityPartnerCard key={p.slug} partner={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-5">
                {g.items.map((p) => (
                  <div key={p.slug} className="w-full sm:w-80">
                    <CommunityPartnerCard partner={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </Container>
    </section>
  );
}
