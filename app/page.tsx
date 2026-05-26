import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { WhatToExpect } from '@/components/sections/WhatToExpect';
import { SpeakersPreview } from '@/components/sections/SpeakersPreview';
import { DayAtGlance } from '@/components/sections/DayAtGlance';
import { KeyDatesSection } from '@/components/sections/KeyDatesSection';
import { CfpSection } from '@/components/sections/CfpSection';
import { VenueSection } from '@/components/sections/VenueSection';
import { TeamPreview } from '@/components/sections/TeamPreview';
import { SponsorStrip } from '@/components/sections/SponsorStrip';
import { CommunityPartners } from '@/components/sections/CommunityPartners';
import { FaqSection } from '@/components/sections/FaqSection';
import { ComingSoon } from '@/components/sections/ComingSoon';
import { getFaqs, getSessions, getSpeakers, getSponsors, getTeam, getPartners, getCfpConfig, getRegistrationConfig, getEventConfig, getKeyDates } from '@/lib/content';
import { getSettings } from '@/lib/payload';
import { siteUrl, formatEventDate } from '@/lib/utils';

export const revalidate = 3600;

export default async function HomePage() {
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
  const [settings, event] = await Promise.all([getSettings() as any, getEventConfig()]);

  // Markdown-first: event.md wins; Payload settings fill anything left blank.
  const headline = event.headline || (settings as any)?.heroHeadline || undefined;
  const subheadline = event.subheadline || (settings as any)?.heroSubheadline || undefined;
  const city = event.city || (settings as any)?.eventCity || 'Gujarat, India';
  const eventDate = event.eventDate || (settings as any)?.eventDate || null;
  const eventEndDate = event.eventEndDate || (settings as any)?.eventEndDate || null;
  const venueName = event.venueName || (settings as any)?.venueName || undefined;
  const venueAddress = event.venueAddress || (settings as any)?.venueAddress || undefined;
  const mapEmbedUrl = event.mapEmbedUrl || (settings as any)?.mapEmbedUrl || undefined;

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'KCD Gujarat 2026',
    description:
      'Kubernetes Community Day Gujarat 2026 — a CNCF-backed, community-driven conference for the cloud-native community.',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: venueName || 'TBD',
      address: venueAddress || city,
    },
    organizer: { '@type': 'Organization', name: 'KCD Gujarat', url: siteUrl('/') },
    url: siteUrl('/'),
  };

  if (comingSoon) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
        />
        <ComingSoon city={city} contactEmail={(settings as any)?.contactEmail} />
      </>
    );
  }

  const [speakers, sessions, sponsors, faqs, team, partners, cfp, registration, keyDates] = await Promise.all([
    getSpeakers(),
    getSessions(),
    getSponsors(),
    getFaqs(),
    getTeam(),
    getPartners(),
    getCfpConfig(),
    getRegistrationConfig(),
    getKeyDates(),
  ]);
  const cfpOpen = cfp.open;
  const registrationOpen = registration.open;

  const registrationUrl = registration.url || (settings as any)?.registrationUrl || process.env.NEXT_PUBLIC_REGISTRATION_URL;
  const cfpUrl = cfp.url || (settings as any)?.cfpUrl || process.env.NEXT_PUBLIC_CFP_URL;
  const eventDateLabel = eventDate ? formatEventDate(eventDate) : 'Conference Day, 2026';

  const fullEventLd = {
    ...eventLd,
    startDate: eventDate || undefined,
    endDate: eventEndDate || eventDate || undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fullEventLd) }}
      />
      <HeroSection
        headline={headline}
        subheadline={subheadline}
        eventDate={eventDate}
        city={city}
        registrationUrl={registrationUrl}
        registrationOpen={registrationOpen}
        cfpUrl={cfpUrl}
        cfpOpen={cfpOpen}
        cfpDeadline={cfp.deadline}
        showSpeakers={cfp.showSpeakers}
      />
      <AboutSection />
      <WhatToExpect cfpUrl={cfpUrl} cfpDeadline={cfp.deadline} cfpOpen={cfpOpen} />
      <KeyDatesSection items={keyDates} eventDate={eventDate} />
      {cfp.showSpeakers && <SpeakersPreview speakers={speakers} />}
      <DayAtGlance eventDateLabel={eventDateLabel} cfpOpen={cfpOpen} showSpeakers={cfp.showSpeakers} timeline={event.timeline} />
      {sessions.length > 0 && null}
      {cfpOpen && <CfpSection cfpUrl={cfpUrl} />}
      <VenueSection
        venueName={venueName}
        venueAddress={venueAddress}
        mapEmbedUrl={mapEmbedUrl}
      />
      <TeamPreview team={team} />
      <SponsorStrip sponsors={sponsors} />
      <CommunityPartners partners={partners} />
      <FaqSection faqs={faqs} />
    </>
  );
}
