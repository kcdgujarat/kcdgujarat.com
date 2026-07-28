'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavItem = { href: string; label: string; speakersOnly?: boolean; cfpOnly?: boolean; teamOnly?: boolean };

const NAV: NavItem[] = [
  { href: '/#about', label: 'About' },
  { href: '/#key-dates', label: 'Key Dates' },
  { href: '/speakers', label: 'Speakers', speakersOnly: true },
  { href: '/schedule', label: 'Schedule', speakersOnly: true },
  { href: '/#cfp', label: 'CFP', cfpOnly: true },
  { href: '/#venue', label: 'Venue' },
  { href: '/#team', label: 'Organisers', teamOnly: true },
  { href: '/#sponsors', label: 'Sponsors' },
  { href: '/#partners', label: 'Partners' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/badge', label: '🎟️ Badge' },
];

interface HeaderProps {
  /** Current path from the server (via proxy `x-pathname` header). */
  pathname?: string;
  registrationOpen?: boolean;
  comingSoon?: boolean;
  cfpOpen?: boolean;
  showSpeakers?: boolean;
  showTeam?: boolean;
}

export function Header({
  registrationOpen = false,
  comingSoon = false,
  cfpOpen = false,
  showSpeakers = false,
  showTeam = false,
}: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  // Every nav link points at the homepage section (`/#section`). From any page
  // this navigates home and scrolls to the anchor (offset by the sticky header
  // via `scroll-margin-top` in globals.css). No bare `#hash` links — those only
  // work on `/` and silently break on sub-pages like /cfp or /venue.

  const navItems = NAV.filter((item) => {
    if (item.speakersOnly && !showSpeakers) return false;
    if (item.cfpOnly && !cfpOpen) return false;
    if (item.teamOnly && !showTeam) return false;
    return true;
  });

  // Primary CTA: register only, routed to the internal /register page.
  const showCta = registrationOpen;
  const primaryHref = '/register';
  const primaryLabel = 'Register Now';

  // Inline nav needs ~1280px+ (xl). iPad Pro portrait is 1024px — hamburger
  // there so brand / links / CTA never overlap.
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto w-full max-w-[100rem] px-3 py-3 sm:px-5 lg:px-8">
        <div
          className={cn(
            'kcd-glass relative flex w-full items-center gap-2 rounded-full px-3 py-2 sm:gap-3 sm:px-4',
            comingSoon ? 'justify-center' : undefined,
          )}
        >
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-base font-semibold text-kcd-ink sm:text-lg"
          >
            <span className="relative inline-block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white/40" aria-hidden>
              <Image src="/images/KCDGujaratLogoSmall500x500.png" alt="" fill sizes="36px" className="object-contain p-0.5" />
            </span>
            <span className="hidden sm:inline">KCD Gujarat 2026</span>
          </Link>

          {!comingSoon && (
            <>
              <nav
                aria-label="Primary"
                className="hidden min-w-0 flex-1 justify-center overflow-hidden xl:flex"
              >
                <ul className="flex items-center justify-center gap-0.5 text-sm font-medium 2xl:gap-1">
                  {navItems.map((item) => (
                    <li key={item.href} className="shrink-0">
                      <Link className="kcd-glass-link whitespace-nowrap !px-2 2xl:!px-[0.9rem]" href={item.href}>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
                {showCta && (
                  <ButtonLink
                    href={primaryHref}
                    size="sm"
                    className="hidden rounded-full whitespace-nowrap px-4 sm:inline-flex"
                  >
                    {primaryLabel}
                  </ButtonLink>
                )}
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/30 text-kcd-ink backdrop-blur xl:hidden"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {!comingSoon && open && (
        <div className="xl:hidden">
          <Container className="pb-3">
            <ul className="kcd-glass flex flex-col gap-1 rounded-3xl p-3 text-base font-medium text-kcd-ink">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="kcd-glass-link w-full justify-start"
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              {showCta && (
                <li className="pt-2 sm:hidden">
                  <ButtonLink href={primaryHref} className="w-full rounded-full whitespace-nowrap">
                    {primaryLabel}
                  </ButtonLink>
                </li>
              )}
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
