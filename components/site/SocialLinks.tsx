import { cn } from '@/lib/utils';
import { Github, Instagram, Linkedin, Twitter, Youtube } from '@/components/ui/social-icons';
import { hasSiteSocialLinks, type SiteSocialLinks } from '@/lib/site-social';

const SOCIAL_ITEMS: {
  key: keyof SiteSocialLinks;
  label: string;
  Icon: typeof Twitter;
}[] = [
  { key: 'x', label: 'X', Icon: Twitter },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'github', label: 'GitHub', Icon: Github },
  { key: 'youtube', label: 'YouTube', Icon: Youtube },
];

interface SocialLinksProps {
  links: SiteSocialLinks;
  /** Footer sits on dark navy; other sections use muted ink on light backgrounds. */
  variant?: 'footer' | 'inline';
  className?: string;
}

export function SocialLinks({ links, variant = 'inline', className }: SocialLinksProps) {
  if (!hasSiteSocialLinks(links)) return null;

  const linkClass =
    variant === 'footer'
      ? 'rounded-full border border-white/15 bg-white/5 p-2 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white'
      : 'rounded-full border border-kcd-border bg-kcd-subtle p-2 text-kcd-muted hover:border-kcd-primary/30 hover:text-kcd-primary';

  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)} aria-label="Social media">
      {SOCIAL_ITEMS.filter(({ key }) => links[key]).map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            aria-label={label}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('inline-flex transition-colors', linkClass)}
          >
            <Icon className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
