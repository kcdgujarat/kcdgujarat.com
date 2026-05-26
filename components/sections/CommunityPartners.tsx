import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import type { Partner } from '@/lib/content';

interface Props {
  partners: Partner[];
}

export function CommunityPartners({ partners }: Props) {
  if (partners.length === 0) {
    return null;
  }
  return (
    <section id="partners" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Community Partners"
          title="Built with our community"
          description="We&apos;re proud to collaborate with organizations that share our passion for cloud-native technologies and community building."
          align="center"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((p) => {
            const external = p.url?.startsWith('http');
            const Wrapper: React.ElementType = p.url ? Link : 'div';
            const wrapperProps = p.url
              ? { href: p.url, ...(external ? { target: '_blank', rel: 'noreferrer' } : {}) }
              : {};
            return (
              <Wrapper
                key={p.slug}
                {...wrapperProps}
                className="flex flex-col rounded-3xl border border-kcd-border bg-white p-6 shadow-card"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-kcd-primary/10 text-kcd-primary">
                  {p.logoUrl ? (
                    <Image
                      src={p.logoUrl}
                      alt={`${p.name} logo`}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="font-display text-lg font-bold">
                      {p.name
                        .split(' ')
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-kcd-ink">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm text-kcd-ink/70">{p.description}</p>
                {p.url && (
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-kcd-primary">
                    Learn more →
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
