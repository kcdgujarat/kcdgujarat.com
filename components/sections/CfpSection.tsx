import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import type { CfpFormatIcon, CfpHomeSection } from '@/lib/schema';
import { GraduationCap, Megaphone, Users, Wrench, type LucideIcon } from 'lucide-react';

const FORMAT_ICONS: Record<CfpFormatIcon, LucideIcon> = {
  megaphone: Megaphone,
  wrench: Wrench,
  'graduation-cap': GraduationCap,
  users: Users,
  group: Users,
};

type CfpSectionProps = {
  homeSection: CfpHomeSection;
};

export function CfpSection({ homeSection }: CfpSectionProps) {
  return (
    <section id="cfp" className="py-20">
      <Container>
        <SectionHeader
          eyebrow={homeSection.eyebrow}
          title={homeSection.title}
          description={homeSection.description}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {homeSection.cards.map((card) => {
            const Icon = FORMAT_ICONS[card.icon];
            return (
              <Card key={card.title}>
                <CardBody>
                  <Icon className="h-7 w-7 text-kcd-primary" aria-hidden />
                  <CardTitle className="mt-4">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardBody>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/cfp" size="lg">
            Submit a Talk
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
