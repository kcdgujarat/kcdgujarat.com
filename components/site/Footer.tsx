import Image from 'next/image';
import Link from 'next/link';
import { Container } from './Container';
import { SocialLinks } from './SocialLinks';
import type { SiteSocialLinks } from '@/lib/site-social';
import { EVENT_NAME } from '@/lib/brand';

interface FooterProps {
  socials?: SiteSocialLinks;
  contactEmail?: string;
  cfpOpen?: boolean;
  showSpeakers?: boolean;
  showTeam?: boolean;
  showVenue?: boolean;
}

export function Footer({
  socials = {},
  contactEmail,
  cfpOpen = false,
  showSpeakers = false,
  showTeam = false,
  showVenue = false,
}: FooterProps) {
  const eventLinks = [
    ...(showSpeakers
      ? [
          { href: '/speakers', label: 'Speakers' },
          { href: '/schedule', label: 'Schedule' },
        ]
      : []),
    { href: '/sponsors', label: 'Sponsors' },
    // Withheld until the venue is announced — /venue 404s while the flag is off.
    ...(showVenue ? [{ href: '/venue', label: 'Venue' }] : []),
  ];
  const getInvolvedLinks = [
    ...(cfpOpen ? [{ href: '/cfp', label: 'Submit a Talk' }] : []),
    { href: '/sponsorship', label: 'Become a Sponsor' },
    ...(showTeam ? [{ href: '/#team', label: 'Organisers' }] : []),
  ];
  return (
    <footer className="relative isolate mt-24 overflow-hidden border-t border-white/10 bg-kcd-navy text-white">
      <div className="jharokha-footer pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 font-display text-lg font-semibold">
            <Image
              src="/images/KCDGujaratLogoSmall500x500.png"
              alt={EVENT_NAME}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 object-contain"
            />
            {EVENT_NAME}
          </div>
          <p className="mt-3 text-sm text-white/70">
            A community-driven, CNCF-backed conference for the cloud-native community in Gujarat, India.
          </p>
          <SocialLinks links={socials} variant="footer" className="mt-5 justify-start" />
          {cfpOpen && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
              CFP Open
            </p>
          )}
        </div>
        <FooterColumn title="Event" links={eventLinks} />
        <FooterColumn title="Get involved" links={getInvolvedLinks} />
        <FooterColumn
          title="Resources"
          links={[
            { href: '/code-of-conduct', label: 'Code of Conduct' },
            { href: '/faq', label: 'FAQ' },
            ...(contactEmail ? [{ href: `mailto:${contactEmail}`, label: 'Contact' }] : []),
          ]}
        />
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} {EVENT_NAME}. KCD is a CNCF program.</p>
          <SocialLinks links={socials} variant="footer" />
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-white">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-white/70">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-kcd-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
