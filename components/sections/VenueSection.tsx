import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { Accessibility, BedDouble, Bus, Car } from 'lucide-react';

interface VenueSectionProps {
  venueName?: string;
  venueAddress?: string;
  mapEmbedUrl?: string;
}

export function VenueSection({ venueName, venueAddress, mapEmbedUrl }: VenueSectionProps) {
  return (
    <section id="venue" className="bg-kcd-subtle/50 py-20">
      <Container>
        <SectionHeader
          eyebrow="Venue"
          title={venueName || 'Venue to be announced'}
          description={venueAddress || 'We are finalising a venue with great transit access. Details land soon.'}
        />
        {mapEmbedUrl && (
          <div className="overflow-hidden rounded-2xl border border-kcd-border shadow-card">
            <iframe
              src={mapEmbedUrl}
              title="Venue map"
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard Icon={Bus} title="Public transport" body="Metro, bus, and train guidance closer to the event." />
          <InfoCard Icon={Car} title="Parking" body="On-site and nearby parking guidance once venue is set." />
          <InfoCard Icon={BedDouble} title="Stay" body="Suggested hotels and hostels at multiple price points." />
          <InfoCard Icon={Accessibility} title="Accessibility" body="Step-free access, accessible washrooms, quiet room." />
        </div>
        <div className="mt-10 text-center">
          <Link href="/venue" className="text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline">
            Full venue details →
          </Link>
        </div>
      </Container>
    </section>
  );
}

function InfoCard({ Icon, title, body }: { Icon: any; title: string; body: string }) {
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
