import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';

const PALETTES = [
  'from-kcd-primary/30 via-kcd-primary/10 to-kcd-green/20',
  'from-kcd-orange/25 via-kcd-yellow/20 to-kcd-orange/10',
  'from-kcd-green/30 via-emerald-300/15 to-kcd-primary/15',
  'from-kcd-yellow/30 via-amber-300/20 to-kcd-orange/15',
  'from-kcd-primary/25 via-sky-300/15 to-kcd-green/20',
  'from-kcd-orange/20 via-pink-300/15 to-kcd-yellow/20',
  'from-emerald-400/25 via-kcd-green/15 to-teal-400/20',
  'from-kcd-primary/30 via-indigo-300/15 to-kcd-orange/15',
];

export function PastEvents() {
  return (
    <section id="past-events" className="bg-kcd-surface py-20">
      <Container>
        <SectionHeader
          eyebrow="From the community"
          title="Glimpses from our meetups"
          description="CNCG Gujarat has been running monthly meetups, study jams, and hands-on sessions. Here's a taste of what to expect at KCD."
          align="center"
        />
        <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
          {PALETTES.map((palette, i) => (
            <div
              key={i}
              className={`relative aspect-[4/3] w-72 shrink-0 overflow-hidden rounded-3xl border border-kcd-border bg-gradient-to-br md:w-auto ${palette}`}
              aria-hidden
            >
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-kcd-navy/60 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
                <span>Meetup #{i + 1}</span>
                <span className="text-white/70">CNCG Gujarat</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
