import { Container } from '@/components/site/Container';
import { AccordionItem } from '@/components/ui/accordion';
import { getFaqSections } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { EVENT_NAME } from '@/lib/brand';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'FAQ',
  path: '/faq',
  description: `Frequently asked questions about ${EVENT_NAME}.`,
});

export default async function FaqPage() {
  const sections = await getFaqSections();
  return (
    <Container className="max-w-3xl py-16">
      <header className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-kcd-primary">FAQ</p>
        <h1 className="font-display text-3xl font-bold text-kcd-ink sm:text-4xl">
          Frequently asked questions
        </h1>
      </header>
      {sections.length === 0 ? (
        <p className="text-kcd-muted">FAQs will be added soon.</p>
      ) : (
        <div className="space-y-12">
          {sections.map(({ section, faqs }) => (
            <section key={section} aria-labelledby={`faq-${section}`}>
              <h2
                id={`faq-${section}`}
                className="mb-4 font-display text-xl font-semibold text-kcd-ink"
              >
                {section}
              </h2>
              <div className="rounded-2xl border border-kcd-border bg-white px-6 shadow-card">
                {faqs.map((f) => (
                  <AccordionItem key={f.slug} question={f.question}>
                    <div dangerouslySetInnerHTML={{ __html: f.answerHtml }} />
                  </AccordionItem>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
