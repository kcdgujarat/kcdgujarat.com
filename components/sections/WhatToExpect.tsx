import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { Code2, Wrench, Users, Sparkles, Megaphone } from 'lucide-react';
import { formatEventDate } from '@/lib/utils';

const ITEMS = [
  {
    icon: Code2,
    title: 'Technical Sessions',
    body: 'Deep-dive talks on Kubernetes, cloud-native technologies, and modern DevOps practices.',
  },
  {
    icon: Wrench,
    title: 'Hands-on Workshops',
    body: 'Interactive, instructor-led learning experiences with industry experts.',
  },
  {
    icon: Users,
    title: 'Networking',
    body: 'Connect with like-minded developers, SREs, and platform engineers from across India.',
  },
  {
    icon: Sparkles,
    title: 'Community Building',
    body: 'Strengthen the local Kubernetes and cloud-native community here in Gujarat.',
  },
];

interface Props {
  cfpDeadline?: string;
  cfpOpen?: boolean;
}

export function WhatToExpect({ cfpDeadline, cfpOpen = true }: Props) {
  return (
    <section className="py-20" id="what-to-expect">
      <Container>
        <SectionHeader
          eyebrow="What to expect"
          title="A full day of cloud-native, end to end."
          description="Talks, workshops, networking, and community moments — all packed into one Saturday in Gujarat."
          align="center"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardBody>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-kcd-primary/10 text-kcd-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <CardTitle className="mt-4">{title}</CardTitle>
                <CardDescription>{body}</CardDescription>
              </CardBody>
            </Card>
          ))}
        </div>

        {cfpOpen && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-kcd-border bg-white p-6 shadow-card md:flex-row md:p-8">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-kcd-accent/15 text-kcd-orange">
                <Megaphone className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-kcd-ink">Call for Proposals</h3>
                <p className="text-sm text-kcd-ink/70">
                  Submit your talk proposals for KCD Gujarat 2026.
                  {cfpDeadline ? ` Deadline: ${formatEventDate(cfpDeadline)}.` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/cfp"
                className="inline-flex h-11 items-center justify-center rounded-full bg-kcd-primary px-6 text-xs font-bold uppercase tracking-wider !text-white"
              >
                Submit a Talk
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
