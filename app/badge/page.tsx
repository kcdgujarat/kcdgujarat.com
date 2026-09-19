import { getEventConfig, getSocialLinks } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { formatEventDateRangeShort, siteUrl } from '@/lib/utils';
import { BadgeGenerator } from './BadgeGenerator';

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "I'm Attending Badge",
  path: '/badge',
  description:
    "Generate your personalised \"I'm Attending\" badge for Kubernetes Community Day Gujarat 2026 and share it on social media!",
});

/** `https://x.com/kcdgujarat` -> `@kcdgujarat`. Undefined if the URL has no path. */
function handleFrom(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const name = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
    return name ? `@${name}` : undefined;
  } catch {
    return undefined;
  }
}

export default async function BadgePage() {
  const [event, socials] = await Promise.all([getEventConfig(), getSocialLinks()]);

  const when = formatEventDateRangeShort(event.eventDate, event.eventEndDate);
  const where = event.city;
  const handle = handleFrom(socials.x);

  // Composed here rather than in the component so the handle, date and city all
  // come from content (CLAUDE.md §12).
  const shareText = [
    `I'm attending KCD Gujarat 2026`,
    when ? ` on ${when}` : '',
    where ? ` in ${where}` : '',
    '!',
    handle ? ` Join me at ${handle}` : '',
  ].join('');

  return (
    <BadgeGenerator
      shareText={shareText}
      shareUrl={siteUrl('/badge')}
      handle={handle}
      handleUrl={socials.x}
    />
  );
}
