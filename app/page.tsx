import { ComingSoon } from '@/components/sections/ComingSoon';
import { getSettings } from '@/lib/payload';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export default async function HomePage() {
  const settings = (await getSettings()) as any;

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'KCD Gujarat 2026',
    description:
      'Kubernetes Community Day Gujarat 2026 — a CNCF-backed, community-driven conference for the cloud-native community.',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: settings?.venueName || 'TBD',
      address: settings?.venueAddress || (settings?.eventCity ?? 'Gujarat, India'),
    },
    organizer: { '@type': 'Organization', name: 'KCD Gujarat', url: siteUrl('/') },
    url: siteUrl('/'),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <ComingSoon city={settings?.eventCity} contactEmail={settings?.contactEmail} />
    </>
  );
}
