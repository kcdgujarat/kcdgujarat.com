import Link from 'next/link';
import Image from 'next/image';
import type { Partner } from '@/lib/content';

export function CommunityPartnerCard({ partner }: { partner: Partner }) {
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
