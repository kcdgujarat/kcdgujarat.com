import Image from 'next/image';
import { Container } from '@/components/site/Container';

interface ComingSoonProps {
  city?: string;
  contactEmail?: string;
}

export function ComingSoon({ city = 'Gujarat, India', contactEmail }: ComingSoonProps) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-white via-kcd-subtle to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(26,115,232,0.14),_transparent_60%)]"
      />
      <Container className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center">
        <div className="relative h-48 w-48 sm:h-64 sm:w-64 md:h-72 md:w-72">
          <Image
            src="/images/logo.jpg"
            alt="KCD Gujarat 2026 logo"
            fill
            priority
            sizes="(max-width: 640px) 12rem, (max-width: 768px) 16rem, 18rem"
            className="object-contain drop-shadow-xl"
          />
        </div>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-kcd-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kcd-primary">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-kcd-accent" />
          CNCF Kubernetes Community Day
        </p>

        <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-kcd-ink sm:text-5xl md:text-6xl">
          KCD Gujarat 2026
        </h1>
        <p className="mt-3 font-display text-2xl font-semibold text-kcd-primary sm:text-3xl">
          Coming soon.
        </p>
        <p className="mt-5 max-w-xl text-base text-kcd-muted sm:text-lg">
          A community-driven, CNCF-backed Kubernetes Community Day for the cloud-native community in {city}.
          Speaker line-up, schedule, and venue dropping shortly.
        </p>

        {contactEmail && (
          <p className="mt-10 text-sm text-kcd-muted">
            Sponsorship or speaking enquiries:{' '}
            <a className="font-medium text-kcd-primary underline-offset-4 hover:underline" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          </p>
        )}
      </Container>
    </section>
  );
}
