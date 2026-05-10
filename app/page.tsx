import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { KeyDatesSection } from '@/components/sections/KeyDatesSection';
import { SpeakersPreview } from '@/components/sections/SpeakersPreview';
import { SchedulePreview } from '@/components/sections/SchedulePreview';
import { VenueSection } from '@/components/sections/VenueSection';
import { CfpSection } from '@/components/sections/CfpSection';
import { SponsorStrip } from '@/components/sections/SponsorStrip';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { getFaqs, getKeyDates, getSessions, getSpeakers, getSponsors } from '@/lib/content';
import { getSettings } from '@/lib/payload';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export default async function HomePage() {
  const [speakers, sessions, sponsors, faqs, keyDates, settings] = await Promise.all([
    getSpeakers(),
    getSessions(),
    getSponsors(),
    getFaqs(),
    getKeyDates(),
    getSettings() as any,
  ]);

  const eventDate = settings?.eventDate || null;
  const registrationUrl = settings?.registrationUrl || process.env.NEXT_PUBLIC_REGISTRATION_URL;
  const cfpUrl = settings?.cfpUrl || process.env.NEXT_PUBLIC_CFP_URL;

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'KCD Gujarat 2026',
    description:
      'Kubernetes Community Day Gujarat 2026 — a CNCF-backed, community-driven conference for the cloud-native community.',
    startDate: eventDate || undefined,
    endDate: settings?.eventEndDate || eventDate || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
      <HeroSection
        headline={settings?.heroHeadline}
        subheadline={settings?.heroSubheadline}
        eventDate={eventDate}
        city={settings?.eventCity}
        registrationUrl={registrationUrl}
        cfpUrl={cfpUrl}
      />
      <AboutSection />
      <KeyDatesSection items={keyDates} eventDate={eventDate} />
      <SpeakersPreview speakers={speakers} />
      <SchedulePreview sessions={sessions} />
      <VenueSection
        venueName={settings?.venueName}
        venueAddress={settings?.venueAddress}
        mapEmbedUrl={settings?.mapEmbedUrl}
      />
      <SponsorStrip sponsors={sponsors} />
      <CfpSection cfpUrl={cfpUrl} />
      <FaqSection faqs={faqs} />
      <CtaSection registrationUrl={registrationUrl} cfpUrl={cfpUrl} />
    </>
  );
}
