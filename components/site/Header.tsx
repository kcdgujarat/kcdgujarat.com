'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavItem = { href: string; label: string; speakersOnly?: boolean; cfpOnly?: boolean };

const NAV: NavItem[] = [
  { href: '/#about', label: 'About' },
  { href: '/speakers', label: 'Speakers', speakersOnly: true },
  { href: '/schedule', label: 'Schedule', speakersOnly: true },
  { href: '/#cfp', label: 'CFP', cfpOnly: true },
  { href: '/#venue', label: 'Venue' },
  { href: '/#team', label: 'Team' },
  { href: '/#sponsors', label: 'Sponsors' },
  { href: '/#faq', label: 'FAQ' },
];

interface HeaderProps {
  registrationUrl?: string;
  registrationOpen?: boolean;
  comingSoon?: boolean;
  cfpOpen?: boolean;
  cfpUrl?: string;
  showSpeakers?: boolean;
}

export function Header({ registrationUrl, registrationOpen = false, comingSoon = false, cfpOpen = false, cfpUrl, showSpeakers = false }: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  // On the homepage, anchor links become pure hash links so the browser
  // does an in-page smooth scroll without navigating. On any other page
  // the full `/#section` href is kept so the browser loads `/` and jumps
  // straight to the anchor without re-scrolling from the top.
  const resolveHref = (href: string) =>
    isHome && href.startsWith('/#') ? href.slice(1) : href;

  const navItems = NAV.filter((item) => {
    if (item.speakersOnly && !showSpeakers) return false;
    if (item.cfpOnly && !cfpOpen) return false;
    return true;
  });

  // Primary CTA: CFP takes precedence; registration shown only when open.
  const showCta = cfpOpen || registrationOpen;
  const primaryHref = cfpOpen ? (cfpUrl || '/cfp') : (registrationUrl || '/register');
  const primaryLabel = cfpOpen ? 'Submit a Talk' : 'Register';

  return (
    <header className="sticky top-0 z-40">
      <Container className="py-3">
        <div
          className={cn(
            'kcd-glass relative flex items-center gap-4 rounded-full px-3 py-2 sm:px-4',
            comingSoon ? 'justify-center' : 'justify-between',
          )}
        >
          <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold text-kcd-ink sm:text-lg">
            <span className="relative inline-block h-9 w-9 overflow-hidden rounded-full bg-white ring-2 ring-white/40" aria-hidden>
              <Image src="/images/KCDGujaratLogoSmall500x500.png" alt="" fill sizes="36px" className="object-contain p-0.5" />
            </span>
            <span className="hidden sm:inline">KCD Gujarat 2026</span>
          </Link>

          {!comingSoon && (
            <>
              <nav aria-label="Primary" className="hidden md:block">
                <ul className="flex items-center gap-1 text-sm font-medium">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link className="kcd-glass-link" href={resolveHref(item.href)}>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              {showCta && (
                <div className="hidden md:block">
                  <ButtonLink href={primaryHref} size="sm" className="rounded-full">
                    {primaryLabel}
                  </ButtonLink>
                </div>
              )}
              <button
                type="button"
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/30 text-kcd-ink backdrop-blur"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </Container>

      {!comingSoon && open && (
        <div className="md:hidden">
          <Container className="pb-3">
            <ul className="kcd-glass flex flex-col gap-1 rounded-3xl p-3 text-base font-medium text-kcd-ink">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={resolveHref(item.href)}
                    className="kcd-glass-link w-full justify-start"
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              {showCta && (
                <li className="pt-2">
                  <ButtonLink href={primaryHref} className="w-full rounded-full">
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
