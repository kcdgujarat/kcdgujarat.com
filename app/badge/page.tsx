import { buildMetadata } from '@/lib/seo';
import { BadgeGenerator } from './BadgeGenerator';
import { EVENT_NAME } from '@/lib/brand';

export const metadata = buildMetadata({
  title: "I'm Attending Badge",
  path: '/badge',
  description:
    `Generate your personalised "I'm Attending" badge for ${EVENT_NAME} and share it on social media!`,
});

export default function BadgePage() {
  return <BadgeGenerator />;
}
