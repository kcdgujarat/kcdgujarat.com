import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { AccordionItem } from '@/components/ui/accordion';
import { getFaqs } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'FAQ',
  path: '/faq',
  description: 'Frequently asked questions about KCD Gujarat 2026.',
});

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <Container className="py-16 max-w-3xl">
      <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
      {faqs.length === 0 ? (
        <p className="text-kcd-muted">FAQs will be added soon.</p>
      ) : (
        <div className="rounded-2xl border border-kcd-border bg-white px-6 shadow-card">
          {faqs.map((f) => (
            <AccordionItem key={f.slug} question={f.question}>
              <div dangerouslySetInnerHTML={{ __html: f.answerHtml }} />
            </AccordionItem>
          ))}
        </div>
      )}
    </Container>
  );
}
