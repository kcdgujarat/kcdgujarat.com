import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Code of Conduct',
  path: '/code-of-conduct',
  description: 'Our community standards for KCD Gujarat 2026.',
});

export default function CodeOfConductPage() {
  return (
    <Container className="py-16 max-w-3xl">
      <SectionHeader eyebrow="Community" title="Code of Conduct" />
      <div className="prose prose-sm max-w-none text-kcd-ink">
        <p>
          KCD Gujarat 2026 follows the{' '}
          <a href="https://github.com/cncf/foundation/blob/main/code-of-conduct.md" target="_blank" rel="noreferrer">
            CNCF Community Code of Conduct
          </a>
          . By attending, speaking, sponsoring, or volunteering at this event, you agree to abide by it.
        </p>
        <h3>Our standards</h3>
        <ul>
          <li>Be welcoming, inclusive, and respectful in language and behaviour.</li>
          <li>Assume good intent. Disagree without being disagreeable.</li>
          <li>Harassment of any kind is not tolerated, online or in person.</li>
        </ul>
        <h3>Reporting</h3>
        <p>
          If you witness or experience a violation, contact the organizers at the designated channel printed on the
          event lanyard, or email the contact address listed in the footer. Reports are handled in confidence.
        </p>
        <h3>Consequences</h3>
        <p>
          Violations may result in a warning, removal from sessions or the venue, and being banned from future
          editions of KCD Gujarat.
        </p>
      </div>
    </Container>
  );
}
