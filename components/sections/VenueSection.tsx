import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { VenueHeroPhoto } from '@/components/site/VenuePhotos';
import { VenueTravelList, orderVenueTravel } from '@/components/site/VenueTravel';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import type { VenuePhoto, VenueTravelItem } from '@/lib/schema';
import { Accessibility, Car, MapPin } from 'lucide-react';

interface VenueSectionProps {
  venueName?: string;
  venueAddress?: string;
  mapEmbedUrl?: string;
  venuePhotos?: VenuePhoto[];
  venueTravel?: VenueTravelItem[];
  venueDirectionsUrl?: string;
}

export function VenueSection({
  venueName,
  venueAddress,
  mapEmbedUrl,
  venuePhotos = [],
  venueTravel = [],
  venueDirectionsUrl,
}: VenueSectionProps) {
  const travel = orderVenueTravel(venueTravel);
  const [hero] = venuePhotos;
  // The map is the fallback for a venue with no photo yet — once there is a
  // photo it earns the space, and the embedded map lives on /venue.
  const showMap = !hero && Boolean(mapEmbedUrl);

  return (
    <section id="venue" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Venue"
          title={venueName || 'Venue to be announced'}
          description={
            venueAddress ||
            'We are finalising a venue with great transit access. Details land soon.'
          }
        />

        {/* Same clickable frame as /venue, so a venue photo behaves the same
            wherever it appears — paging through the whole set either way. */}
        <VenueHeroPhoto photos={venuePhotos} />


        {showMap && (
          <div className="overflow-hidden rounded-2xl border border-kcd-border shadow-card">
            <iframe
              src={mapEmbedUrl}
              title={venueName ? `Map showing ${venueName}` : 'Venue map'}
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {travel.length > 0 ? (
          <>
            <h3 className="mt-10 font-display text-xl font-semibold text-kcd-ink">Getting here</h3>
            {/* Notes are suppressed here — the homepage wants the numbers, and
                /venue has the room for the "which terminal" detail. */}
            <VenueTravelList
              items={travel}
              showNotes={false}
              className="mt-4 grid gap-4 md:grid-cols-3"
            />
          </>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <InfoCard
              Icon={MapPin}
              title="Getting here"
              body="Travel guidance from the airport, bus stand, and railway station lands with the venue."
            />
            <InfoCard
              Icon={Car}
              title="Parking"
              body="On-site and nearby parking guidance once the venue is set."
            />
            <InfoCard
              Icon={Accessibility}
              title="Accessibility"
              body="Step-free access, accessible washrooms, quiet room."
            />
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold">
          <Link href="/venue" className="text-kcd-primary underline-offset-4 hover:underline">
            Full venue details →
          </Link>
          {venueDirectionsUrl && (
            <a
              href={venueDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-kcd-primary underline-offset-4 hover:underline"
            >
              Get directions →
            </a>
          )}
        </div>
      </Container>
    </section>
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
