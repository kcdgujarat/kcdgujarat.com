import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { GraduationCap, Megaphone, Wrench } from 'lucide-react';

export function CfpSection({ cfpUrl }: { cfpUrl?: string }) {
  return (
    <section id="cfp" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="CFP"
          title="Call for Proposals"
          description="We are looking for talks, workshops, and lightning sessions across our tracks. First-time speakers warmly encouraged."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardBody>
              <Megaphone className="h-7 w-7 text-kcd-primary" aria-hidden />
              <CardTitle className="mt-4">Talks</CardTitle>
              <CardDescription>30-minute sessions sharing real-world experience and lessons learned.</CardDescription>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Wrench className="h-7 w-7 text-kcd-primary" aria-hidden />
              <CardTitle className="mt-4">Workshops</CardTitle>
              <CardDescription>Hands-on sessions that send attendees home with something usable.</CardDescription>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <GraduationCap className="h-7 w-7 text-kcd-primary" aria-hidden />
              <CardTitle className="mt-4">Lightning</CardTitle>
              <CardDescription>Five-minute talks. Great for first-time speakers.</CardDescription>
            </CardBody>
          </Card>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={cfpUrl || '#'} size="lg">
            Submit on Sessionize
          </ButtonLink>
          <Link href="/cfp" className="text-sm font-semibold text-kcd-primary underline-offset-4 hover:underline">
            CFP details →
          </Link>
        </div>
      </Container>
    </section>
  );
}
