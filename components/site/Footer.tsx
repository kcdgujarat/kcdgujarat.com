import Image from 'next/image';
import Link from 'next/link';
import { Container } from './Container';
import { Github, Linkedin, Twitter, Youtube } from '@/components/ui/social-icons';

interface FooterProps {
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  contactEmail?: string;
  cfpOpen?: boolean;
  cfpUrl?: string;
  showSpeakers?: boolean;
}

export function Footer({ socials = {}, contactEmail, cfpOpen = false, cfpUrl, showSpeakers = false }: FooterProps) {
  const eventLinks = [
    ...(showSpeakers
      ? [
          { href: '/speakers', label: 'Speakers' },
          { href: '/schedule', label: 'Schedule' },
        ]
      : []),
    { href: '/sponsors', label: 'Sponsors' },
    { href: '/venue', label: 'Venue' },
  ];
  const getInvolvedLinks = [
    ...(cfpOpen
      ? [{ href: cfpUrl || '/cfp', label: 'Submit a Talk' }]
      : []),
    { href: '/sponsorship', label: 'Become a Sponsor' },
    { href: '/team', label: 'Organizers & Team' },
  ];
  return (
    <footer className="mt-24 border-t border-white/10 bg-kcd-navy text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 font-display text-lg font-semibold">
            <Image
              src="/images/KCDGujaratLogoSmall500x500.png"
              alt="KCD Gujarat 2026"
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 object-contain"
            />
            KCD Gujarat 2026
          </div>
          <p className="mt-3 text-sm text-white/70">
            A community-driven Kubernetes Community Day for the cloud-native community in Gujarat, India.
          </p>
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
          <p>© {new Date().getFullYear()} KCD Gujarat. KCD is a CNCF program.</p>
          <ul className="flex items-center gap-4">
            {socials.twitter && (
              <li>
                <a aria-label="Twitter / X" href={socials.twitter} target="_blank" rel="noreferrer" className="hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
              </li>
            )}
            {socials.linkedin && (
              <li>
                <a aria-label="LinkedIn" href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </a>
              </li>
            )}
            {socials.github && (
              <li>
                <a aria-label="GitHub" href={socials.github} target="_blank" rel="noreferrer" className="hover:text-white">
                  <Github className="h-5 w-5" />
                </a>
              </li>
            )}
            {socials.youtube && (
              <li>
                <a aria-label="YouTube" href={socials.youtube} target="_blank" rel="noreferrer" className="hover:text-white">
                  <Youtube className="h-5 w-5" />
                </a>
              </li>
            )}
          </ul>
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
