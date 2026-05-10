import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ButtonLink } from '@/components/ui/button';
import { getSettings } from '@/lib/payload';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Call for Proposals',
  path: '/cfp',
  description: 'Submit a talk or workshop proposal for KCD Gujarat 2026.',
});

export default async function CfpPage() {
  const settings = (await getSettings()) as any;
  const cfpUrl = settings?.cfpUrl || process.env.NEXT_PUBLIC_CFP_URL;
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="CFP"
        title="Call for Proposals"
        description="We are looking for talks, workshops, and lightning sessions across Platform, DevSecOps, AI/ML, Networking, and Beginner tracks."
      />
      <div className="prose prose-sm max-w-3xl text-kcd-ink">
        <h3>What we are looking for</h3>
        <ul>
          <li>Real-world experience reports — what worked, what didn&apos;t, what you would do differently.</li>
          <li>Hands-on workshops that leave attendees with something they can use.</li>
          <li>Beginner-friendly talks that demystify cloud-native concepts.</li>
        </ul>
        <h3>Submission</h3>
        <p>Submit your proposal on Sessionize. First-time speakers are warmly encouraged.</p>
      </div>
      <div className="mt-8">
        <ButtonLink href={cfpUrl || '#'} size="lg">
          Submit on Sessionize
        </ButtonLink>
      </div>
    </Container>
  );
}
