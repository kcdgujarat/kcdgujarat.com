import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody } from '@/components/ui/card';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Team',
  path: '/team',
  description: 'The organizers and volunteers behind KCD Gujarat 2026.',
});

const ORGANIZERS: { name: string; role: string }[] = [
  { name: 'Organizer Name', role: 'Lead Organizer' },
  { name: 'Organizer Name', role: 'Programme Chair' },
  { name: 'Organizer Name', role: 'Sponsorship Lead' },
];

export default function TeamPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Team"
        title="Organizers and volunteers"
        description="A small but mighty team of community volunteers makes this event possible. Want to help? Get in touch."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ORGANIZERS.map((o) => (
          <Card key={`${o.name}-${o.role}`}>
            <CardBody>
              <p className="font-semibold text-kcd-ink">{o.name}</p>
              <p className="mt-1 text-sm text-kcd-muted">{o.role}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </Container>
  );
}
