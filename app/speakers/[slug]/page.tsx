import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { Badge } from '@/components/ui/badge';
import { getSessions, getSpeakers } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/utils';
import { Globe } from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/ui/social-icons';

export const revalidate = 3600;

export async function generateStaticParams() {
  const speakers = await getSpeakers();
  return speakers.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const speakers = await getSpeakers();
  const s = speakers.find((sp) => sp.slug === slug);
  if (!s) return buildMetadata({ title: 'Speaker not found' });
  return buildMetadata({
    title: s.name,
    description: `${s.name}${s.role ? `, ${s.role}` : ''}${s.company ? ` at ${s.company}` : ''} — speaker at KCD Gujarat 2026.`,
    path: `/speakers/${s.slug}`,
    image: s.photoUrl,
  });
}

export default async function SpeakerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [speakers, sessions] = await Promise.all([getSpeakers(), getSessions()]);
  const s = speakers.find((sp) => sp.slug === slug);
  if (!s) notFound();
  const speakerSessions = sessions.filter((sess) => sess.speakers?.includes(s.slug));

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: s.name,
    jobTitle: s.role,
    worksFor: s.company ? { '@type': 'Organization', name: s.company } : undefined,
    sameAs: [s.socials?.twitter, s.socials?.linkedin, s.socials?.github, s.socials?.website].filter(Boolean),
    image: s.photoUrl,
    url: siteUrl(`/speakers/${s.slug}`),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <Container className="py-16">
        <Link href="/speakers" className="text-sm text-kcd-primary hover:underline">
          ← All speakers
        </Link>
        <div className="mt-6 grid gap-10 md:grid-cols-[280px_1fr]">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-kcd-border bg-kcd-subtle">
              {s.photoUrl ? (
                <Image src={s.photoUrl} alt={s.name} fill className="object-cover" sizes="280px" />
              ) : (
                <div className="flex h-full items-center justify-center text-5xl font-bold text-kcd-muted">
                  {s.name
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              )}
            </div>
            <SocialLinks socials={s.socials || {}} />
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold text-kcd-ink">{s.name}</h1>
            {(s.role || s.company) && (
              <p className="mt-2 text-lg text-kcd-muted">
                {[s.role, s.company].filter(Boolean).join(' · ')}
              </p>
            )}
            {s.bioHtml && (
              <div
                className="prose prose-sm mt-6 max-w-none text-kcd-ink"
                dangerouslySetInnerHTML={{ __html: s.bioHtml }}
              />
            )}
            {speakerSessions.length > 0 && (
              <section className="mt-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-kcd-muted">Sessions</h2>
                <ul className="mt-4 space-y-3">
                  {speakerSessions.map((sess) => (
                    <li key={sess.slug}>
                      <Link
                        href={`/schedule/${sess.slug}`}
                        className="block rounded-xl border border-kcd-border bg-white p-4 transition-shadow hover:shadow-card"
                      >
                        <p className="font-semibold text-kcd-ink">{sess.title}</p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs">
                          {sess.track && <Badge>{sess.track}</Badge>}
                          {sess.type && <Badge>{sess.type}</Badge>}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

function SocialLinks({ socials }: { socials: { twitter?: string; linkedin?: string; github?: string; website?: string } }) {
  const items = [
    { href: socials.twitter, label: 'Twitter / X', Icon: Twitter },
    { href: socials.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: socials.github, label: 'GitHub', Icon: Github },
    { href: socials.website, label: 'Website', Icon: Globe },
  ].filter((i) => i.href);
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 flex gap-3">
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-kcd-border text-kcd-ink hover:bg-kcd-subtle"
          >
            <Icon className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
