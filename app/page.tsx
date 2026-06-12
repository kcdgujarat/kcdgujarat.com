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
import {
  getFaqs,
  getSessions,
  getSpeakers,
  getSponsors,
  getTeam,
  getPartners,
  getCfpConfig,
  getRegistrationConfig,
  getEventConfig,
  getKeyDates,
  getSocialLinks,
} from '@/lib/content';
import { siteUrl, formatEventDate, formatWindowMoment } from '@/lib/utils';

export const revalidate = 3600;

export default async function HomePage() {
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
  const [event, socialLinks] = await Promise.all([getEventConfig(), getSocialLinks()]);

  const headline = event.headline;
  const subheadline = event.subheadline;
  const city = event.city || 'Gujarat, India';
  const eventDate = event.eventDate || null;
  const eventEndDate = event.eventEndDate || null;
  const venueName = event.venueName;
  const venueAddress = event.venueAddress;
  const mapEmbedUrl = event.mapEmbedUrl;

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
        <ComingSoon city={city} contactEmail={event.contactEmail} socialLinks={socialLinks} />
      </>
    );
  }

  const showTeam = event.showTeam;

  const [speakers, sessions, sponsors, faqs, team, partners, cfp, registration, keyDates] =
    await Promise.all([
      getSpeakers(),
      getSessions(),
      getSponsors(),
      getFaqs(),
      showTeam ? getTeam() : Promise.resolve([]),
      getPartners(),
      getCfpConfig(),
      getRegistrationConfig(),
      getKeyDates(),
    ]);
  const cfpOpen = cfp.open;
  const cfpClosesLabel = formatWindowMoment(cfp.endDate, cfp.endTime, 'en-IN', cfp.timezone);
  const registrationOpen = registration.open;

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
        registrationOpen={registrationOpen}
        cfpOpen={cfpOpen}
        cfpClosesLabel={cfpClosesLabel}
        showSpeakers={cfp.showSpeakers}
      />
      <AboutSection />
      <WhatToExpect cfpClosesLabel={cfpClosesLabel} cfpOpen={cfpOpen} />
      <KeyDatesSection items={keyDates} eventDate={eventDate} />
      {cfp.showSpeakers && <SpeakersPreview speakers={speakers} />}
      <DayAtGlance
        eventDateLabel={eventDateLabel}
        cfpOpen={cfpOpen}
        showSpeakers={cfp.showSpeakers}
        timeline={event.timeline}
      />
      {sessions.length > 0 && null}
      {cfpOpen && <CfpSection homeSection={cfp.homeSection} />}
      <VenueSection venueName={venueName} venueAddress={venueAddress} mapEmbedUrl={mapEmbedUrl} />
      {showTeam && <TeamPreview team={team} />}
      <SponsorStrip sponsors={sponsors} />
      <CommunityPartners partners={partners} />
      <FaqSection faqs={faqs} />
    </>
  );
}
