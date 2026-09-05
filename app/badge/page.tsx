import { buildMetadata } from '@/lib/seo';
import { BadgeGenerator } from './BadgeGenerator';

export const metadata = buildMetadata({
  title: "I'm Attending Badge",
  path: '/badge',
  description:
    "Generate your personalised \"I'm Attending\" badge for Kubernetes Community Day Gujarat 2026 and share it on social media!",
});

export default function BadgePage() {
  return <BadgeGenerator />;
}
