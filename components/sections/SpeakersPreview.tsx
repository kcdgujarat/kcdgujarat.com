import Link from 'next/link';
import type { Speaker } from '@/lib/content';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SpeakerCard } from '@/components/site/SpeakerCard';

export function SpeakersPreview({ speakers }: { speakers: Speaker[] }) {
  const featured = speakers.filter((s) => s.featured).slice(0, 8);
  const display = featured.length > 0 ? featured : speakers.slice(0, 8);
  if (display.length === 0) return null;
  return (
    <section id="speakers" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Speakers"
          title="Voices from the cloud-native community"
          description="A glimpse of the talented practitioners taking the stage."
        />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {display.map((s) => (
            <SpeakerCard key={s.slug} speaker={s} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/speakers" className="text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline">
            See all speakers →
          </Link>
        </div>
      </Container>
    </section>
  );
}
