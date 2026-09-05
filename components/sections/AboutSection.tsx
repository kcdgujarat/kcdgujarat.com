import Image from 'next/image';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeader
              eyebrow="About KCD Gujarat 2026"
              title="The cloud-native community day event, finally in Gujarat."
              description="Kubernetes Community Day (KCD) Gujarat 2026 is a CNCF-backed, community-organized conference bringing together developers, operators, and cloud-native enthusiasts from across India and beyond."
            />
            <p className="max-w-xl text-base leading-relaxed text-kcd-ink/80 md:text-lg">
              Set in Ahmedabad, Gujarat, this single-day conference offers a unique opportunity to learn from industry experts, discover what teams are shipping in production, and connect with the growing cloud-native community in western India.
            </p>
          </div>

          <div className="rounded-3xl border border-kcd-border bg-white p-8 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-kcd-muted">
              Supported by
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Image
                src="/static/cncf.svg"
                alt="Cloud Native Computing Foundation"
                width={120}
                height={48}
                unoptimized
                className="h-12 w-auto"
                style={{ width: 'auto' }}
              />
              <span className="font-display text-lg font-semibold text-kcd-ink">
                Cloud Native Computing Foundation
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-kcd-ink/75">
              Kubernetes Community Days are community-organized events that are part of the CNCF ecosystem. As a CNCF event, we receive guidance, resources, and recognition — while staying community-first, grassroots, and rooted in the region we serve.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
