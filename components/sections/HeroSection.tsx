import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { ButtonLink } from '@/components/ui/button';
import { formatEventDate } from '@/lib/utils';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  eventDate?: string | Date | null;
  city?: string;
  registrationUrl?: string;
  cfpUrl?: string;
}

export function HeroSection({
  headline = 'Kubernetes Community Day Gujarat 2026',
  subheadline = 'A community-driven, CNCF-backed conference for the cloud-native community in Gujarat — talks, workshops, and a day of meaningful connections.',
  eventDate,
  city = 'Ahmedabad, Gujarat',
  registrationUrl,
  cfpUrl,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-kcd-subtle to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(26,115,232,0.12),_transparent_60%)]"
      />
      <Container className="relative py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-kcd-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kcd-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-kcd-accent" />
            CNCF Kubernetes Community Day
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-kcd-ink sm:text-5xl md:text-6xl">
            {headline}
          </h1>
          <p className="mt-5 text-lg text-kcd-muted md:text-xl">{subheadline}</p>
          <dl className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-kcd-ink">
            <div>
              <dt className="font-semibold uppercase tracking-wider text-kcd-muted">When</dt>
              <dd>{eventDate ? formatEventDate(eventDate) : 'Coming soon'}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-wider text-kcd-muted">Where</dt>
              <dd>{city}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={registrationUrl || '/register'} size="lg">
              Register
            </ButtonLink>
            <ButtonLink href={cfpUrl || '/cfp'} variant="outline" size="lg">
              Submit a Talk
            </ButtonLink>
            <Link
              href="/schedule"
              className="text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline"
            >
              View schedule →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
