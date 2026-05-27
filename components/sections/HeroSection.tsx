'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/site/Container';
import { formatEventDate } from '@/lib/utils';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  eventDate?: string | Date | null;
  city?: string;
  registrationUrl?: string;
  registrationOpen?: boolean;
  cfpUrl?: string;
  cfpOpen?: boolean;
  cfpDeadline?: string;
  showSpeakers?: boolean;
}

export function HeroSection({
  headline,
  subheadline,
  eventDate,
  city = 'Gujarat, India',
  registrationUrl,
  registrationOpen = false,
  cfpUrl,
  cfpOpen = false,
  cfpDeadline,
  showSpeakers = false,
}: HeroSectionProps) {
  const subtext =
    subheadline ||
    `A community-driven, CNCF-backed Kubernetes Community Day for the cloud-native community in ${city}. Speaker line-up, schedule, and venue dropping shortly.`;
  const dateLabel = eventDate ? formatEventDate(eventDate) : '2026';

  const blurRef = React.useRef<HTMLDivElement>(null);
  const statueRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLDivElement>(null);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) return;

    let ticking = false;
    const apply = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      const y = window.scrollY;
      // Only animate while hero is roughly in view to save work.
      const inView = !rect || (rect.bottom > -200 && rect.top < window.innerHeight + 200);
      if (!inView) {
        ticking = false;
        return;
      }
      const set = (el: HTMLElement | null, tx: number, ty: number, scale = 1) => {
        if (!el) return;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
      };
      set(blurRef.current, y * -0.12, y * 0.28, 1 + y * 0.0004);
      set(statueRef.current, 0, y * -0.22);
      set(headlineRef.current, 0, y * 0.12);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate -mt-px">
      {/* Panel A — cream w/ rainbow gradient blur and statue illustration */}
      <div className="relative overflow-hidden bg-kcd-cream">
        {/* Rainbow blur (parallax) */}
        <div
          ref={blurRef}
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-[120%] w-[55%] opacity-70 blur-3xl will-change-transform"
          style={{
            background:
              'linear-gradient(135deg, #fef9c3 0%, #fde68a 20%, #fed7aa 50%, #fca5a5 75%, #fce7f3 100%)',
          }}
        />

        {/* Statue — desktop: full-height right edge; mobile: anchored bottom-right */}
        <div
          ref={statueRef}
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 will-change-transform max-md:h-[min(40vh,260px)] max-md:w-[82%] md:top-0 md:h-full md:w-[42%]"
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
            <div ref={headlineRef} className="will-change-transform">
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
                  CFP Open{cfpDeadline ? ` · closes ${cfpDeadline}` : ''}
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {cfpOpen ? (
                  <>
                    <Link
                      href={cfpUrl || '/cfp'}
                      className="inline-flex h-12 items-center justify-center rounded-full bg-kcd-primary px-7 text-sm font-bold uppercase tracking-wider !text-white hover:bg-kcd-primary/90"
                    >
                      Submit a Talk
                    </Link>
                    {registrationOpen && (
                      <Link
                        href={registrationUrl || '/register'}
                        className="inline-flex h-12 items-center justify-center rounded-full border-2 border-kcd-ink px-7 text-sm font-bold uppercase tracking-wider text-kcd-ink hover:bg-kcd-ink hover:text-white"
                      >
                        Book Tickets
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    {registrationOpen && (
                      <Link
                        href={registrationUrl || '/register'}
                        className="inline-flex h-12 items-center justify-center rounded-full bg-kcd-primary px-7 text-sm font-bold uppercase tracking-wider !text-white hover:bg-kcd-primary/90"
                      >
                        Book Tickets
                      </Link>
                    )}
                    {showSpeakers && (
                      <>
                        <Link
                          href="/schedule"
                          className="inline-flex h-12 items-center justify-center rounded-full border-2 border-kcd-ink px-7 text-sm font-bold uppercase tracking-wider text-kcd-ink hover:bg-kcd-ink hover:text-white"
                        >
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
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

    </section>
  );
}

