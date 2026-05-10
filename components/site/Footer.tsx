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
}

export function Footer({ socials = {}, contactEmail }: FooterProps) {
  return (
    <footer className="mt-24 border-t border-kcd-border bg-white">
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-kcd-ink">
            <span className="inline-block h-6 w-6 rounded-full bg-kcd-primary" aria-hidden />
            KCD Gujarat 2026
          </div>
          <p className="mt-3 text-sm text-kcd-muted">
            A community-driven Kubernetes Community Day for the cloud-native community in Gujarat, India.
          </p>
        </div>
        <FooterColumn
          title="Event"
          links={[
            { href: '/speakers', label: 'Speakers' },
            { href: '/schedule', label: 'Schedule' },
            { href: '/sponsors', label: 'Sponsors' },
            { href: '/venue', label: 'Venue' },
          ]}
        />
        <FooterColumn
          title="Get involved"
          links={[
            { href: '/cfp', label: 'Call for Proposals' },
            { href: '/sponsorship', label: 'Become a Sponsor' },
            { href: '/team', label: 'Organizers & Team' },
            { href: '/blog', label: 'Blog' },
          ]}
        />
        <FooterColumn
          title="Resources"
          links={[
            { href: '/code-of-conduct', label: 'Code of Conduct' },
            { href: '/faq', label: 'FAQ' },
            ...(contactEmail ? [{ href: `mailto:${contactEmail}`, label: 'Contact' }] : []),
          ]}
        />
      </Container>
      <div className="border-t border-kcd-border">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-kcd-muted md:flex-row">
          <p>© {new Date().getFullYear()} KCD Gujarat. KCD is a CNCF program.</p>
          <ul className="flex items-center gap-4">
            {socials.twitter && (
              <li>
                <a aria-label="Twitter / X" href={socials.twitter} target="_blank" rel="noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </li>
            )}
            {socials.linkedin && (
              <li>
                <a aria-label="LinkedIn" href={socials.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </li>
            )}
            {socials.github && (
              <li>
                <a aria-label="GitHub" href={socials.github} target="_blank" rel="noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </li>
            )}
            {socials.youtube && (
              <li>
                <a aria-label="YouTube" href={socials.youtube} target="_blank" rel="noreferrer">
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
      <h4 className="text-sm font-semibold uppercase tracking-wide text-kcd-ink">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-kcd-muted">
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
