'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/#about', label: 'About' },
  { href: '/#speakers', label: 'Speakers' },
  { href: '/#schedule', label: 'Schedule' },
  { href: '/#venue', label: 'Venue' },
  { href: '/#sponsors', label: 'Sponsors' },
  { href: '/#cfp', label: 'CFP' },
  { href: '/#faq', label: 'FAQ' },
];

interface HeaderProps {
  registrationUrl?: string;
  comingSoon?: boolean;
}

export function Header({ registrationUrl, comingSoon = false }: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-kcd-border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className={cn('flex h-16 items-center', comingSoon ? 'justify-center' : 'justify-between')}>
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-kcd-ink">
          <span className="relative inline-block h-8 w-8" aria-hidden>
            <Image src="/images/logo.jpg" alt="" fill sizes="32px" className="rounded-full object-cover" />
          </span>
          <span>KCD Gujarat 2026</span>
        </Link>

        {!comingSoon && (
          <>
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm font-medium text-kcd-ink">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link className="hover:text-kcd-primary" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="hidden md:block">
              <ButtonLink href={registrationUrl || '/register'} size="sm">
                Register
              </ButtonLink>
            </div>
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-kcd-border text-kcd-ink"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}
      </Container>
      {!comingSoon && (
        <div className={cn('md:hidden border-t border-kcd-border bg-white', !open && 'hidden')}>
          <Container className="py-4">
            <ul className="flex flex-col gap-2 text-base font-medium text-kcd-ink">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-2 py-2 hover:bg-kcd-subtle"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <ButtonLink href={registrationUrl || '/register'} className="w-full">
                  Register
                </ButtonLink>
              </li>
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
