import Link from 'next/link';
import type { Speaker } from '@/lib/content';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SpeakerCard } from '@/components/site/SpeakerCard';

/** How many speakers stand in for the keynotes when nobody is marked yet. */
const FALLBACK_HIGHLIGHT = 8;

export function SpeakersPreview({ speakers }: { speakers: Speaker[] }) {
  if (speakers.length === 0) return null;

  const keynotes = speakers.filter((s) => s.keynote);
  const isKeynoteLead = keynotes.length > 0;
  // Before the keynotes are picked, keep the old behaviour: the first few
  // speakers lead the section instead.
  const highlighted = isKeynoteLead ? keynotes : speakers.slice(0, FALLBACK_HIGHLIGHT);

  return (
    <section id="speakers" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Speakers"
          title={isKeynoteLead ? 'Keynote speakers' : 'Voices from the cloud-native community'}
          description={
            isKeynoteLead
              ? 'Opening the day on the main stage. The full line-up of practitioners is a click away.'
              : 'A glimpse of the talented practitioners taking the stage.'
          }
        />
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {highlighted.map((s) => (
            <li key={s.slug}>
              <SpeakerCard speaker={s} />
            </li>
          ))}
        </ul>
        {speakers.length > highlighted.length && (
          <div className="mt-10 text-center">
            <Link
              href="/speakers"
              className="text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline"
            >
              See all speakers →
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
