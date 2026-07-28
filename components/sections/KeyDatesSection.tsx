import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody } from '@/components/ui/card';
import type { KeyDate } from '@/lib/content';
import { cn } from '@/lib/utils';

const FALLBACK: KeyDate[] = [
  { label: 'CFP opens', value: '2026-04-15' },
  { label: 'CFP closes', value: '2026-06-30' },
  { label: 'Speakers announced', value: '2026-07-31' },
  { label: 'Early-bird tickets', value: '2026-05-01' },
  { label: 'Conference day', value: 'TBD' },
];

interface KeyDatesSectionProps {
  items?: KeyDate[];
  eventDate?: string | null;
}

export function KeyDatesSection({ items, eventDate }: KeyDatesSectionProps) {
  const data = items && items.length > 0 ? items : FALLBACK;
  const resolved = data.map((d) =>
    d.label.toLowerCase() === 'conference day' && eventDate ? { ...d, value: eventDate } : d,
  );
  return (
    <section id="key-dates" className="py-20" aria-labelledby="key-dates-heading">
      <Container>
        <SectionHeader eyebrow="Key dates" title="Save the dates" />
        <div
          className={cn('grid gap-4 sm:grid-cols-2', resolved.length >= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4')}
        >
          {resolved.map((d) => (
            <Card key={`${d.label}-${d.value}`}>
              <CardBody className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-kcd-muted">{d.label}</p>
                <p className="mt-2 font-display text-lg font-semibold text-kcd-ink">{formatDate(d.value)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function formatDate(v: string) {
  if (!v || v === 'TBD') return 'TBD';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
