import type { Faq } from '@/lib/content';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { AccordionItem } from '@/components/ui/accordion';

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <section id="faq" className="py-20">
      <Container className="max-w-3xl">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions" align="center" />
        <div className="rounded-2xl border border-kcd-border bg-white px-6 shadow-card">
          {faqs.map((f) => (
            <AccordionItem key={f.slug} question={f.question}>
              <div dangerouslySetInnerHTML={{ __html: f.answerHtml }} />
            </AccordionItem>
          ))}
        </div>
      </Container>
    </section>
  );
}
