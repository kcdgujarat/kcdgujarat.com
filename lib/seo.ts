import type { Metadata } from 'next';
import { EVENT_NAME } from './brand';
import { siteUrl } from './utils';

const DEFAULT_DESCRIPTION = `${EVENT_NAME} — a CNCF-backed, community-driven conference for the cloud-native community in Gujarat, India.`;

export function buildMetadata(opts: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const title = opts.title ? `${opts.title} — ${EVENT_NAME}` : EVENT_NAME;
  const description = opts.description || DEFAULT_DESCRIPTION;
  const url = siteUrl(opts.path || '/');
  const ogParams = new URLSearchParams({
    title: opts.title || EVENT_NAME,
    subtitle: opts.description
      ? opts.description.slice(0, 80)
      : 'A CNCF-backed community conference in Gujarat, India',
  });
  const image = opts.image || siteUrl(`/api/og?${ogParams.toString()}`);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: EVENT_NAME,
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    icons: {
      icon: '/images/Favicon250x250.png',
      apple: '/images/Favicon250x250.png',
    },
    robots: { index: true, follow: true },
  };
}
