import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SpeakerCard } from '@/components/site/SpeakerCard';
import { getSpeakers, getCfpConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Speakers',
  path: '/speakers',
  description: 'Meet the speakers taking the stage at KCD Gujarat 2026.',
});

export default async function SpeakersPage() {
  const [speakers, cfp] = await Promise.all([getSpeakers(), getCfpConfig()]);

  if (cfp.open) {
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
            Submit your talk proposal {cfp.deadline ? `before ${cfp.deadline}.` : 'while the CFP is open.'}
          </p>
          {cfp.url && (
            <Link
              href={cfp.url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-kcd-primary px-7 text-sm font-bold uppercase tracking-wider !text-white"
            >
              Submit a Talk
            </Link>
          )}
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
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {speakers.map((s) => (
            <SpeakerCard key={s.slug} speaker={s} />
          ))}
        </div>
      )}
    </Container>
  );
}
