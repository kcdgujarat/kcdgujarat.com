import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ButtonLink } from '@/components/ui/button';
import { getRegistrationConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { formatEventDate } from '@/lib/utils';

export const revalidate = 3600;

export async function generateMetadata() {
  const registration = await getRegistrationConfig();
  const startLabel = formatEventDate(registration.startDate);
  const endLabel = registration.endDate ? formatEventDate(registration.endDate) : null;

  if (registration.phase === 'upcoming') {
    return buildMetadata({
      title: 'Register — Opens Soon',
      path: '/register',
      description: startLabel
        ? endLabel
          ? `Tickets for KCD Gujarat 2026 go on sale ${startLabel} and close ${endLabel}.`
          : `Tickets for KCD Gujarat 2026 go on sale ${startLabel}.`
        : registration.description,
    });
  }

  if (registration.phase === 'closed') {
    return buildMetadata({
      title: 'Register — Closed',
      path: '/register',
      description: endLabel
        ? `Registration for KCD Gujarat 2026 closed ${endLabel}.`
        : 'Registration is no longer open.',
    });
  }

  return buildMetadata({
    title: registration.title,
    path: '/register',
    description: registration.description,
  });
}

export default async function RegisterPage() {
  const registration = await getRegistrationConfig();
  const startLabel = formatEventDate(registration.startDate);
  const endLabel = registration.endDate ? formatEventDate(registration.endDate) : null;

  if (registration.phase === 'upcoming') {
    return (
      <Container className="py-16">
        <SectionHeader
          eyebrow={registration.eyebrow}
          title="Registration opens soon"
          description={
            startLabel
              ? endLabel
                ? `Tickets go on sale ${startLabel} and close ${endLabel}.`
                : `Tickets go on sale ${startLabel}.`
              : "We're getting everything ready. Tickets will be available here once registration opens."
          }
        />
        <div className="rounded-2xl border border-kcd-border bg-white p-8 shadow-card text-center">
          <p className="text-kcd-muted">
            Follow us on social media so you don&apos;t miss the opening announcement.
          </p>
        </div>
      </Container>
    );
  }

  if (registration.phase === 'closed') {
    return (
      <Container className="py-16">
        <SectionHeader
          eyebrow={registration.eyebrow}
          title="Registration is closed"
          description={
            endLabel
              ? `Ticket sales closed ${endLabel}. We look forward to seeing registered attendees at the event.`
              : 'Ticket sales are no longer available.'
          }
        />
        <div className="rounded-2xl border border-kcd-border bg-white p-8 shadow-card text-center">
          <p className="text-kcd-muted">
            Questions about your booking? Email the team using the contact link in the footer.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow={registration.eyebrow}
        title={registration.title}
        description={registration.description}
      />
      {endLabel && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-kcd-ink/15 bg-kcd-subtle px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kcd-ink/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-kcd-orange" aria-hidden />
          Registration open{endLabel ? ` · closes ${endLabel}` : ''}
        </p>
      )}
      {registration.bodyHtml && (
        <div
          className="prose prose-sm max-w-3xl text-kcd-ink"
          dangerouslySetInnerHTML={{ __html: registration.bodyHtml }}
        />
      )}
      <div className="mt-8">
        <ButtonLink href={registration.url || '#'} size="lg">
          Go to ticketing
        </ButtonLink>
      </div>
    </Container>
  );
}
