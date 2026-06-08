import { Container } from '@/components/site/Container';
import { MarkdownBody } from '@/components/site/MarkdownBody';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SocialLinks } from '@/components/site/SocialLinks';
import { ButtonLink } from '@/components/ui/button';
import { getRegistrationConfig, getSocialLinks } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { formatWindowMoment } from '@/lib/utils';

export const revalidate = 3600;

export async function generateMetadata() {
  const registration = await getRegistrationConfig();
  const startLabel = formatWindowMoment(
    registration.startDate,
    registration.startTime,
    'en-IN',
    registration.timezone,
  );
  const endLabel = registration.endDate
    ? formatWindowMoment(registration.endDate, registration.endTime, 'en-IN', registration.timezone)
    : null;

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
  const [registration, socialLinks] = await Promise.all([getRegistrationConfig(), getSocialLinks()]);
  const startLabel = formatWindowMoment(
    registration.startDate,
    registration.startTime,
    'en-IN',
    registration.timezone,
  );
  const endLabel = registration.endDate
    ? formatWindowMoment(registration.endDate, registration.endTime, 'en-IN', registration.timezone)
    : null;

  const header =
    registration.phase === 'upcoming'
      ? {
          title: 'Registration opens soon',
          description: startLabel
            ? endLabel
              ? `Tickets go on sale ${startLabel} and close ${endLabel}. Details are below.`
              : `Tickets go on sale ${startLabel}. Details are below.`
            : "We're getting everything ready. Tickets will be available here once registration opens.",
        }
      : registration.phase === 'closed'
        ? {
            title: 'Registration is closed',
            description: endLabel
              ? `Ticket sales closed ${endLabel}. We look forward to seeing registered attendees at the event.`
              : 'Ticket sales are no longer available.',
          }
        : {
            title: registration.title,
            description: registration.description,
          };

  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow={registration.eyebrow}
        title={header.title}
        description={header.description}
      />

      {registration.phase === 'open' && endLabel && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-kcd-ink/15 bg-kcd-subtle px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kcd-ink/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-kcd-orange" aria-hidden />
          Registration open · closes {endLabel}
        </p>
      )}

      <MarkdownBody html={registration.bodyHtml} className={registration.phase === 'open' ? undefined : 'mt-8'} />

      {registration.phase === 'upcoming' && (
        <div className="mt-10 rounded-2xl border border-kcd-border bg-white p-8 shadow-card text-center">
          <p className="text-kcd-muted">
            Follow us on social media so you don&apos;t miss the opening announcement.
          </p>
          <SocialLinks links={socialLinks} className="mt-6" />
        </div>
      )}

      {registration.phase === 'closed' && (
        <div className="mt-10 rounded-2xl border border-kcd-border bg-white p-8 shadow-card text-center">
          <p className="text-kcd-muted">
            Questions about your booking? Email the team using the contact link in the footer.
          </p>
        </div>
      )}

      {registration.phase === 'open' && (
        <div className="mt-8">
          <ButtonLink href={registration.url || '#'} size="lg">
            Go to ticketing
          </ButtonLink>
        </div>
      )}
    </Container>
  );
}
