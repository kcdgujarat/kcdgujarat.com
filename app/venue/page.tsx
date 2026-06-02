import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { getEventConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Accessibility, BedDouble, Bus, Car } from 'lucide-react';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Venue',
  path: '/venue',
  description: 'Venue, travel, parking, accommodation, and accessibility details for KCD Gujarat 2026.',
});

export default async function VenuePage() {
  const event = await getEventConfig();
  const name = event.venueName || 'To be announced';
  const address = event.venueAddress;
  const map = event.mapEmbedUrl;

  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Venue" title={name} description={address || 'Address coming soon.'} />
      {map && (
        <div className="overflow-hidden rounded-2xl border border-kcd-border shadow-card">
          <iframe
            src={map}
            title="Venue map"
            className="h-96 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          Icon={Bus}
          title="Public transport"
          body="Tips for arriving by metro, bus, or train will be shared closer to the date."
        />
        <InfoCard
          Icon={Car}
          title="Parking"
          body="On-site and nearby parking guidance will be added once the venue is finalised."
        />
        <InfoCard
          Icon={BedDouble}
          title="Accommodation"
          body="Suggested hotels and hostels at multiple price points will be listed here."
        />
        <InfoCard
          Icon={Accessibility}
          title="Accessibility"
          body="Step-free access, accessible washrooms, and a quiet room are part of our standard checklist."
        />
      </div>
    </Container>
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
