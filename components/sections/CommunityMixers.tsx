import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { cn } from '@/lib/utils';
import { EVENT_NAME } from '@/lib/brand';

const MIXERS = [
  {
    name: 'Women in Cloud Native',
    description: 'Exclusive gathering for women in the cloud-native community.',
    activities: [
      'Casual networking across DevOps, SRE, and Platform Engineering',
      'BoF discussions on careers, growth, and leadership',
      'Light snacks, refreshments & special goodies',
      'Fun photo session & networking moments',
    ],
    cta: { label: 'RSVP Now', href: '#' },
    gradient: 'from-pink-400/30 via-orange-300/25 to-yellow-300/20',
    eyebrow: 'Mixer 01',
  },
  {
    name: 'Kubestronauts Mixer',
    description: 'Exclusive gathering for Kubestronauts & Golden Kubestronauts.',
    activities: [
      'Connect with peers on the Kubernetes certification journey',
      'Guidance for those planning their Kubestronauts path',
      'BoF discussions on certifications, careers, and growth',
      'Light snacks, refreshments & networking moments',
    ],
    cta: { label: 'RSVP Now', href: '#' },
    gradient: 'from-sky-400/30 via-indigo-400/20 to-purple-400/20',
    eyebrow: 'Mixer 02',
  },
  {
    name: 'Community Leaders',
    description: 'Exclusive for CNCG, Cloud, and Community Partner leads.',
    activities: [
      'Connect with fellow community builders and ecosystem leaders',
      'Share experiences on building and sustaining tech communities',
      'BoF discussions on community growth and leadership',
      'Exchange ideas on collaborations across communities',
    ],
    cta: { label: 'Invite Only', href: '#', disabled: true },
    gradient: 'from-emerald-400/30 via-teal-300/25 to-cyan-300/20',
    eyebrow: 'Mixer 03',
  },
];

export function CommunityMixers() {
  return (
    <section id="mixers" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Community Events"
          title="Community Mixers"
          description={`Exclusive gatherings running alongside ${EVENT_NAME} — connecting community leaders, certified professionals, and women in cloud native.`}
          align="center"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {MIXERS.map((m) => (
            <article
              key={m.name}
              className="relative overflow-hidden rounded-3xl border border-kcd-border bg-white shadow-card"
            >
              <div className={cn('h-32 w-full bg-gradient-to-br', m.gradient)} aria-hidden />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-kcd-primary">{m.eyebrow}</p>
                <h3 className="mt-1 font-display text-xl font-bold text-kcd-ink">{m.name}</h3>
                <p className="mt-2 text-sm text-kcd-ink/75">{m.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-kcd-ink/80">
                  {m.activities.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-kcd-primary" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {m.cta.disabled ? (
                    <span className="inline-flex h-11 items-center justify-center rounded-full border border-kcd-border bg-kcd-subtle px-5 text-xs font-bold uppercase tracking-wider text-kcd-muted">
                      ✉️ {m.cta.label}
                    </span>
                  ) : (
                    <Link
                      href={m.cta.href}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-kcd-primary px-5 text-xs font-bold uppercase tracking-wider !text-white"
                    >
                      🎟️ {m.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-kcd-ink/65">
          🎟️ Mixers are exclusively for {EVENT_NAME} registered attendees. ✉️ Community Leaders Mixer is invite only.
        </p>
      </Container>
    </section>
  );
}
