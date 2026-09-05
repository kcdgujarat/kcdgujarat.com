import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { CommunityPartnerCard } from '@/components/sections/CommunityPartnerCard';
import { PartnerGrid } from '@/components/sections/PartnerGrid';
import type { Partner } from '@/lib/content';
import { EVENT_NAME } from '@/lib/brand';

interface Props {
  partners: Partner[];
}

type PartnerType = NonNullable<Partner['type']>;

const GROUPS: { type: PartnerType; eyebrow: string; title: string; description?: string }[] = [
  {
    type: 'cloud-native',
    eyebrow: 'Cloud Native Community Partners',
    title: 'Powered by the cloud-native community',
    description:
      `CNCF community groups across India rallying the cloud-native ecosystem behind ${EVENT_NAME}.`,
  },
  {
    type: 'community',
    eyebrow: 'Other Community Partners',
    title: 'Built with our community',
    description:
      'We’re proud to collaborate with organizations that share our passion for technology and community building.',
  },
  {
    type: 'media',
    eyebrow: 'Media Partners',
    title: 'Spreading the word',
    description: 'Helping us reach the cloud-native community far and wide.',
  },
  {
    type: 'venue',
    eyebrow: 'Venue Partner',
    title: 'Where we gather',
    description: `Hosting ${EVENT_NAME}.`,
  },
];

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
            {g.type === 'community' || g.type === 'cloud-native' ? (
              <PartnerGrid partners={g.items} />
            ) : (
              <ul className="flex flex-wrap justify-center gap-5">
                {g.items.map((p) => (
                  <li key={p.slug} className="w-full sm:w-80">
                    <CommunityPartnerCard partner={p} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </Container>
    </section>
  );
}
