import type { Metadata } from 'next';
import { siteUrl } from './utils';

const SITE_NAME = 'KCD Gujarat 2026';
const DEFAULT_DESCRIPTION =
  'Kubernetes Community Day Gujarat 2026 — a CNCF-backed, community-driven conference for the cloud-native community in Gujarat, India.';

export function buildMetadata(opts: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const title = opts.title ? `${opts.title} — ${SITE_NAME}` : `${SITE_NAME} — Kubernetes Community Day, Gujarat`;
  const description = opts.description || DEFAULT_DESCRIPTION;
  const url = siteUrl(opts.path || '/');
  const ogParams = new URLSearchParams({
    title: opts.title || 'KCD Gujarat 2026',
    subtitle: opts.description ? opts.description.slice(0, 80) : 'Kubernetes Community Day, Gujarat',
  });
  const image = opts.image || siteUrl(`/api/og?${ogParams.toString()}`);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
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
