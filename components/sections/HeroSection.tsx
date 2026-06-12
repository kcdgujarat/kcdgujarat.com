import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/site/Container';
import { formatEventDate } from '@/lib/utils';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  eventDate?: string | Date | null;
  city?: string;
  registrationOpen?: boolean;
  cfpOpen?: boolean;
  /** Pre-formatted CFP close label (date, or date + time). */
  cfpClosesLabel?: string;
  showSpeakers?: boolean;
}

export function HeroSection({
  headline,
  subheadline,
  eventDate,
  city = 'Gujarat, India',
  registrationOpen = false,
  cfpOpen = false,
  cfpClosesLabel,
  showSpeakers = false,
}: HeroSectionProps) {
  const subtext =
    subheadline ||
    `A community-driven, CNCF-backed Kubernetes Community Day for the cloud-native community in ${city}. Speaker line-up, schedule, and venue dropping shortly.`;
  const dateLabel = eventDate ? formatEventDate(eventDate) : '2026';

  // Shared CTA style — every hero button is an identical solid pill.
  const ctaPrimary =
    'inline-flex h-12 items-center justify-center rounded-full border-2 border-transparent bg-kcd-primary px-7 text-sm font-bold uppercase tracking-wider !text-white hover:bg-kcd-primary/90';

  return (
    <section className="relative isolate -mt-px">
      {/* Panel A — cream w/ rainbow gradient blur and statue illustration */}
      <div className="relative overflow-hidden bg-kcd-cream">
        {/* Rainbow blur */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-[120%] w-[55%] opacity-70 blur-3xl"
          style={{
            background:
              'linear-gradient(135deg, #fef9c3 0%, #fde68a 20%, #fed7aa 50%, #fca5a5 75%, #fce7f3 100%)',
          }}
        />

        {/* Statue — desktop: full-height right edge; mobile: anchored bottom-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 max-md:h-[min(32vh,210px)] max-md:w-[82%] max-md:translate-y-4 md:top-0 md:h-full md:w-[42%]"
        >
          <Image
            src="/images/sardarpatel.svg"
            alt="Sardar Vallabhbhai Patel illustration"
            fill
            className="object-contain object-right-bottom"
            priority
          />
        </div>

        <Container className="relative py-16 max-md:pb-[min(36vh,240px)] md:py-24">
          {/* Text occupies the left ~55% on desktop; full width on mobile */}
          <div className="max-w-[55%] max-md:max-w-full">
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-kcd-ink sm:text-6xl md:text-7xl">
              {headline ? (
                headline
              ) : (
                <>
                  Kubernetes Community Days{' '}
                  <span className="text-kcd-orange">Gujarat</span>{' '}
                  <span className="ml-1 inline-flex items-center rounded-full border-2 border-kcd-ink px-4 py-1 align-middle text-2xl font-bold sm:text-3xl">
                    2026
                  </span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-kcd-ink/80 md:text-lg">
              {subtext}
            </p>
            {cfpOpen && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-kcd-ink/15 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kcd-ink/80 backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-kcd-orange" />
                CFP Open{cfpClosesLabel ? ` · closes ${cfpClosesLabel}` : ''}
              </p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {registrationOpen && (
                <Link href="/register" className={ctaPrimary}>
                  Register Now
                </Link>
              )}
              {showSpeakers && (
                <>
                  <Link href="/schedule" className={ctaPrimary}>
                    View Schedule
                  </Link>
                  <Link
                    href="/speakers"
                    className="text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline"
                  >
                    Meet the speakers →
                  </Link>
                </>
              )}
              {cfpOpen && (
                <Link href="/cfp" className={ctaPrimary}>
                  Submit a Talk
                </Link>
              )}
              <Link href="/sponsorship" className={ctaPrimary}>
                Become a Sponsor
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
