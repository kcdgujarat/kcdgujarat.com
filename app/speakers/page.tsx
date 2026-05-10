import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SpeakerCard } from '@/components/site/SpeakerCard';
import { getSpeakers } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Speakers',
  path: '/speakers',
  description: 'Meet the speakers taking the stage at KCD Gujarat 2026.',
});

export default async function SpeakersPage() {
  const speakers = await getSpeakers();
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Speakers"
        title="Voices from the cloud-native community"
        description="Practitioners, contributors, and leaders sharing what they have learned."
      />
      {speakers.length === 0 ? (
        <p className="text-kcd-muted">Speaker line-up will be announced soon. Check back shortly.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {speakers.map((s) => (
            <SpeakerCard key={s.slug} speaker={s} />
          ))}
        </div>
      )}
    </Container>
  );
}
