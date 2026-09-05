import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SpeakerCard } from '@/components/site/SpeakerCard';
import { getSpeakers, getCfpConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { formatEventDate, formatWindowMoment } from '@/lib/utils';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Speakers',
  path: '/speakers',
  description: 'Meet the speakers taking the stage at KCD Gujarat 2026.',
});

export default async function SpeakersPage() {
  const [speakers, cfp] = await Promise.all([getSpeakers(), getCfpConfig()]);
  if (!cfp.showSpeakers) notFound();

  // Keynotes lead the grid; everyone else keeps the loader's order.
  const ordered = [...speakers.filter((s) => s.keynote), ...speakers.filter((s) => !s.keynote)];

  const startLabel = formatWindowMoment(cfp.startDate, cfp.startTime, 'en-IN', cfp.timezone);
  const endLabel = formatWindowMoment(cfp.endDate, cfp.endTime, 'en-IN', cfp.timezone);

  if (cfp.phase === 'open') {
    return (
      <Container className="py-16">
        <SectionHeader
          eyebrow="Speakers"
          title="Speakers announce after CFP closes"
          description="The Call for Proposals is currently open. We will announce the speaker line-up once it closes and the selection is locked."
        />
        <div className="rounded-3xl border border-dashed border-kcd-border bg-white p-8 text-center shadow-card md:p-10">
          <p className="font-display text-xl font-semibold text-kcd-ink">Want to speak at KCD Gujarat 2026?</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-kcd-ink/70">
            Submit your talk proposal{endLabel ? ` before ${endLabel}.` : ' while the CFP is open.'}
          </p>
          <Link
            href="/cfp"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-kcd-primary px-7 text-sm font-bold uppercase tracking-wider !text-white"
          >
            Submit a Talk
          </Link>
        </div>
      </Container>
    );
  }

  if (cfp.phase === 'upcoming') {
    return (
      <Container className="py-16">
        <SectionHeader
          eyebrow="Speakers"
          title="Speaker line-up coming soon"
          description={
            startLabel
              ? `The Call for Proposals opens ${startLabel} and closes ${endLabel}. Speakers will be announced after submissions close.`
              : 'Speakers will be announced after the Call for Proposals closes.'
          }
        />
        <div className="rounded-3xl border border-dashed border-kcd-border bg-white p-8 text-center shadow-card md:p-10">
          <p className="text-sm text-kcd-ink/70">
            <Link href="/cfp" className="font-semibold text-kcd-primary underline-offset-4 hover:underline">
              CFP details →
            </Link>
          </p>
        </div>
      </Container>
    );
  }

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
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {ordered.map((s) => (
            <li key={s.slug}>
              <SpeakerCard speaker={s} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
