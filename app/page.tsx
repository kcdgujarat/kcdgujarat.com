import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { WhatToExpect } from '@/components/sections/WhatToExpect';
import { SpeakersPreview } from '@/components/sections/SpeakersPreview';
import { DayAtGlance } from '@/components/sections/DayAtGlance';
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
  getSocialLinks,
} from '@/lib/content';
import { siteUrl, formatEventDate, formatWindowMoment } from '@/lib/utils';

export const revalidate = 3600;

export default async function HomePage() {
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
  const [event, socialLinks] = await Promise.all([getEventConfig(), getSocialLinks()]);

  const headline = event.headline;
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

  const [speakers, sponsors, faqs, team, partners, cfp, registration, sessions] =
    await Promise.all([
      getSpeakers(),
      getSponsors(),
      getFaqs(),
      showTeam ? getTeam() : Promise.resolve([]),
      getPartners(),
      getCfpConfig(),
      getRegistrationConfig(),
      getSessions(),
    ]);
  // Homepage shows a curated subset; the full grouped list lives on /faq.
  const featuredFaqs = faqs.filter((f) => f.featured);
  const homeFaqs = featuredFaqs.length > 0 ? featuredFaqs : faqs;
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
        eventDate={eventDate}
        eventEndDate={eventEndDate}
        city={city}
        registrationOpen={registrationOpen}
        cfpOpen={cfpOpen}
        cfpClosesLabel={cfpClosesLabel}
        showSpeakers={cfp.showSpeakers}
      />
      {/* Render order; nulls dropped so the cream/surface alternation stays
          uniform regardless of which sections are gated off this cycle. */}
      {[
        <AboutSection key="about" />,
        <WhatToExpect key="expect" cfpClosesLabel={cfpClosesLabel} cfpOpen={cfpOpen} />,
        cfp.showSpeakers && speakers.length > 0 ? (
          <SpeakersPreview key="speakers" speakers={speakers} />
        ) : null,
        <DayAtGlance
          key="schedule"
          eventDateLabel={eventDateLabel}
          cfpOpen={cfpOpen}
          showSpeakers={cfp.showSpeakers}
          timeline={event.timeline}
          // Withheld until the lineup is public, so the card can't leak the
          // schedule before the announcement.
          sessions={cfp.showSpeakers ? sessions : []}
        />,
        cfpOpen ? <CfpSection key="cfp" homeSection={cfp.homeSection} /> : null,
        <VenueSection
          key="venue"
          venueName={venueName}
          venueAddress={venueAddress}
          mapEmbedUrl={mapEmbedUrl}
        />,
        showTeam ? <TeamPreview key="team" team={team} /> : null,
        <SponsorStrip key="sponsors" sponsors={sponsors} />,
        partners.length > 0 ? <CommunityPartners key="partners" partners={partners} /> : null,
        homeFaqs.length > 0 ? (
          <FaqSection key="faq" faqs={homeFaqs} hasMore={faqs.length > homeFaqs.length} />
        ) : null,
      ]
        .filter(Boolean)
        .map((section, i) => (
          <div key={i} className={i % 2 === 1 ? 'bg-kcd-surface' : undefined}>
            {section}
          </div>
        ))}
    </>
  );
}
