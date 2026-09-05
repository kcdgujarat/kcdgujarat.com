import { Container } from '@/components/site/Container';
import { MarkdownBody } from '@/components/site/MarkdownBody';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SocialLinks } from '@/components/site/SocialLinks';
import { ButtonLink } from '@/components/ui/button';
import { getCfpConfig, getSocialLinks } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { formatWindowMoment } from '@/lib/utils';
import { EVENT_NAME } from '@/lib/brand';

export const revalidate = 3600;

export async function generateMetadata() {
  const cfp = await getCfpConfig();
  const startLabel = formatWindowMoment(cfp.startDate, cfp.startTime, 'en-IN', cfp.timezone);
  const endLabel = formatWindowMoment(cfp.endDate, cfp.endTime, 'en-IN', cfp.timezone);

  if (cfp.phase === 'upcoming') {
    return buildMetadata({
      title: 'Call for Proposals — Opens Soon',
      path: '/cfp',
      description: startLabel
        ? `The ${EVENT_NAME} CFP opens ${startLabel} and closes ${endLabel}.`
        : cfp.description,
    });
  }

  if (cfp.phase === 'closed') {
    return buildMetadata({
      title: 'Call for Proposals — Closed',
      path: '/cfp',
      description: endLabel
        ? `Submissions for ${EVENT_NAME} closed ${endLabel}.`
        : cfp.description,
    });
  }

  return buildMetadata({
    title: cfp.title,
    path: '/cfp',
    description: cfp.description,
  });
}

export default async function CfpPage() {
  const [cfp, socialLinks] = await Promise.all([getCfpConfig(), getSocialLinks()]);
  const cfpUrl = cfp.url || process.env.NEXT_PUBLIC_CFP_URL;
  const startLabel = formatWindowMoment(cfp.startDate, cfp.startTime, 'en-IN', cfp.timezone);
  const endLabel = formatWindowMoment(cfp.endDate, cfp.endTime, 'en-IN', cfp.timezone);

  const header =
    cfp.phase === 'upcoming'
      ? {
          title: 'Call for Proposals opens soon',
          description: startLabel
            ? `The CFP opens ${startLabel} and closes ${endLabel}. Review the guidelines below and check back to submit your talk.`
            : 'The submission window will be announced soon. Guidelines are below.',
        }
      : cfp.phase === 'closed'
        ? {
            title: 'Call for Proposals is closed',
            description: endLabel
              ? `Submissions closed ${endLabel}. Thank you to everyone who submitted a proposal.`
              : 'Submissions are no longer being accepted.',
          }
        : {
            title: cfp.title,
            description: cfp.description,
          };

  return (
    <Container className="py-16">
      <SectionHeader eyebrow={cfp.eyebrow} title={header.title} description={header.description} />

      {cfp.phase === 'open' && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-kcd-ink/15 bg-kcd-subtle px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kcd-ink/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-kcd-orange" aria-hidden />
          CFP open{endLabel ? ` · closes ${endLabel}` : ''}
        </p>
      )}

      {cfp.phase === 'open' && (
        <div className="mb-8">
          <ButtonLink href={cfpUrl || '#'} size="lg">
            Submit on Sessionize
          </ButtonLink>
        </div>
      )}

      <MarkdownBody html={cfp.bodyHtml} className={cfp.phase === 'open' ? undefined : 'mt-8'} />

      {cfp.phase === 'upcoming' && (
        <div className="mt-10 rounded-2xl border border-kcd-border bg-white p-8 shadow-card text-center">
          <p className="text-kcd-muted">
            Follow us on social media so you don&apos;t miss the opening announcement.
          </p>
          <SocialLinks links={socialLinks} className="mt-6" />
        </div>
      )}

      {cfp.phase === 'closed' && (
        <div className="mt-10 rounded-2xl border border-kcd-border bg-white p-8 shadow-card text-center">
          <p className="text-kcd-muted">
            The speaker line-up will be announced after the selection process is complete.
          </p>
        </div>
      )}

      {cfp.phase === 'open' && (
        <div className="mt-8">
          <ButtonLink href={cfpUrl || '#'} size="lg">
            Submit on Sessionize
          </ButtonLink>
        </div>
      )}
    </Container>
  );
}
