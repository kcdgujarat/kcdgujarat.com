import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card';
import { Cpu, Users, Globe, Sparkles } from 'lucide-react';

const PILLARS = [
  {
    icon: Users,
    title: 'Community-driven',
    body: 'Built by Kubernetes practitioners and CNCF community members in Gujarat, for the Gujarat tech community.',
  },
  {
    icon: Cpu,
    title: 'Hands-on',
    body: 'Talks, workshops, and lightning sessions across Platform, DevSecOps, AI/ML, and Networking tracks.',
  },
  {
    icon: Globe,
    title: 'CNCF-backed',
    body: 'Part of the global Kubernetes Community Days program — same playbook, distinctly Gujarati flavour.',
  },
  {
    icon: Sparkles,
    title: 'For everyone',
    body: 'Beginner-friendly tracks, mentorship, and a Code of Conduct we take seriously.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="About KCD"
          title="One day, one community, all things cloud-native"
          description="Kubernetes Community Days bring together adopters, contributors, and the curious for a single day of in-depth technical content and meaningful conversations."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardBody>
                <Icon className="h-7 w-7 text-kcd-primary" aria-hidden />
                <CardTitle className="mt-4">{title}</CardTitle>
                <CardDescription>{body}</CardDescription>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
