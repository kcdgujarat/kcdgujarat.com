import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { VenueHeroPhoto, VenuePhotoGrid } from '@/components/site/VenuePhotos';
import { VenueTravelList, orderVenueTravel } from '@/components/site/VenueTravel';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { getEventConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/utils';
import { Accessibility, BedDouble, ExternalLink, MapPin, UtensilsCrossed } from 'lucide-react';

export const revalidate = 3600;

/**
 * Generated rather than static so the description can't name the venue while
 * `showVenue` is off — the route 404s then, but a crawler that already has the
 * URL should get nothing useful out of the head either.
 */
export async function generateMetadata() {
  const { showVenue } = await getEventConfig();
  if (!showVenue) {
    return buildMetadata({
      title: 'Venue',
      path: '/venue',
      description: 'Venue details for KCD Gujarat 2026.',
    });
  }
  return buildMetadata({
    title: 'Venue',
    path: '/venue',
    description:
      'Narayani Heights, on the Ahmedabad–Gandhinagar highway at Bhat — how to reach KCD Gujarat 2026 from the airport, Ranip Bus Stand, and Ahmedabad Junction.',
  });
}

export default async function VenuePage() {
  const event = await getEventConfig();
  if (!event.showVenue) notFound();

  const name = event.venueName || 'To be announced';
  const address = event.venueAddress;
  const map = event.mapEmbedUrl;
  const photos = event.venuePhotos;
  const travel = orderVenueTravel(event.venueTravel);
  // Photo 0 is the hero above; the rest fill the gallery near the bottom.
  const gallery = photos.slice(1);
  const contactEmail = event.contactEmail;

  // Place, not Event — /venue answers "where is it", and the Event itself is
  // already described on the home page.
  const placeLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
    url: siteUrl('/venue'),
    ...(address
      ? {
          address: { '@type': 'PostalAddress', streetAddress: address, addressCountry: 'IN' },
        }
      : {}),
    ...(event.venueCoordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: event.venueCoordinates[0],
            longitude: event.venueCoordinates[1],
          },
        }
      : {}),
    ...(photos.length > 0 ? { photo: photos.map((p) => siteUrl(p.src)) } : {}),
    ...(event.venueUrl ? { sameAs: event.venueUrl } : {}),
  };

  return (
    <Container className="py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }} />

      <header className="mb-10 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-kcd-primary">Venue</p>
        <h1 className="font-display text-3xl font-bold text-kcd-ink sm:text-4xl">{name}</h1>
        {address && (
          <p className="mt-4 flex gap-2 text-base text-kcd-muted">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-kcd-primary" aria-hidden />
            <span>{address}</span>
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {event.venueDirectionsUrl && (
            <ButtonLink href={event.venueDirectionsUrl}>Get directions</ButtonLink>
          )}
          {event.venueUrl && (
            <ButtonLink href={event.venueUrl} variant="outline">
              Venue website
              <ExternalLink className="h-4 w-4" aria-hidden />
            </ButtonLink>
          )}
        </div>
      </header>

      <VenueHeroPhoto photos={photos} />

      {travel.length > 0 && (
        <section className="mt-14" aria-labelledby="getting-here">
          <h2 id="getting-here" className="font-display text-2xl font-bold text-kcd-ink">
            Getting here
          </h2>
          {/* Kept short enough to sit on one line at desktop width — it still
              wraps cleanly on narrow screens. */}
          <p className="mt-2 text-base text-kcd-muted">
            On the Ahmedabad–Gandhinagar Road in Bhat — a short drive from the airport, easy to reach
            from either city. Distances by road.
          </p>
          <VenueTravelList items={travel} className="mt-6 grid gap-4 md:grid-cols-3" />
        </section>
      )}

      {map && (
        <section className="mt-14" aria-labelledby="on-the-map">
          <h2 id="on-the-map" className="mb-4 font-display text-2xl font-bold text-kcd-ink">
            On the map
          </h2>
          <div className="overflow-hidden rounded-2xl border border-kcd-border shadow-card">
            <iframe
              src={map}
              title={`Map showing ${name}`}
              className="h-96 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      )}

      <section className="mt-14" aria-labelledby="on-the-day">
        <h2 id="on-the-day" className="mb-6 font-display text-2xl font-bold text-kcd-ink">
          On the day
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Only state what we can point at. The accessibility audit is still
              with the organisers, so that card says so rather than guessing —
              a wrong promise there strands somebody at the gate. */}
          <InfoCard
            Icon={UtensilsCrossed}
            title="Food"
            body="Breakfast, lunch, and high tea are all served on site, and the whole menu is pure vegetarian — see the schedule for timings. Tell us about dietary needs when you register and we will pass them to the kitchen."
          />
          <InfoCard
            Icon={BedDouble}
            title="Stay"
            body="The venue is also a hotel, so rooms can be booked on site directly with Narayani Heights. There are also hotels in Bhat, Chandkheda, and around the airport at different price points."
          />
          <InfoCard
            Icon={Accessibility}
            title="Accessibility"
            body={
              contactEmail
                ? `Both halls are on the venue's event floor. If you need step-free access, reserved seating, or anything else to attend comfortably, email ${contactEmail} and we will arrange it before the day.`
                : "Both halls are on the venue's event floor. If you need step-free access, reserved seating, or anything else to attend comfortably, get in touch and we will arrange it before the day."
            }
          />
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="mt-14" aria-labelledby="venue-photos">
          <h2 id="venue-photos" className="mb-6 font-display text-2xl font-bold text-kcd-ink">
            Inside the venue
          </h2>
          {/* offset 1 — the hero is photo 0, and it has its own frame above. */}
          <VenuePhotoGrid photos={photos} offset={1} />
          <p className="mt-4 text-sm text-kcd-muted">Photos courtesy of {name}.</p>
        </section>
      )}
    </Container>
  );
}

function InfoCard({
  Icon,
  title,
  body,
}: {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardBody>
        <Icon className="h-7 w-7 text-kcd-primary" aria-hidden />
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{body}</CardDescription>
      </CardBody>
    </Card>
  );
}
