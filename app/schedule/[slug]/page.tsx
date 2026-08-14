import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { Badge } from '@/components/ui/badge';
import { getSessions, getSpeakers, getCfpConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { TRACK_BY_SCHEMA } from '@/lib/tracks';
import { cn, formatTime } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams() {
  const cfp = await getCfpConfig();
  if (!cfp.showSpeakers || cfp.phase === 'open' || cfp.phase === 'upcoming') return [];
  const sessions = await getSessions();
  return sessions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sessions = await getSessions();
  const s = sessions.find((x) => x.slug === slug);
  if (!s) return buildMetadata({ title: 'Session not found' });
  return buildMetadata({
    title: s.title,
    description: s.abstract?.slice(0, 160) || `${s.title} — KCD Gujarat 2026 session.`,
    path: `/schedule/${s.slug}`,
  });
}

export default async function SessionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [sessions, speakers, cfp] = await Promise.all([
    getSessions(),
    getSpeakers(),
    getCfpConfig(),
  ]);
  if (!cfp.showSpeakers || cfp.phase === 'open' || cfp.phase === 'upcoming') notFound();
  const s = sessions.find((x) => x.slug === slug);
  if (!s) notFound();
  const sessionSpeakers = speakers.filter((sp) => s.speakers?.includes(sp.slug));

  return (
    <Container className="py-16">
      <Link href="/schedule" className="text-sm text-kcd-primary hover:underline">
        ← Back to schedule
      </Link>
      <article className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs text-kcd-muted">
          {s.start && <span>{formatTime(s.start)}</span>}
          {s.room && <span>· {s.room}</span>}
          {s.durationMinutes && <span>· {s.durationMinutes} min</span>}
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold text-kcd-ink">{s.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {s.track && (
            <Badge className={cn('border-transparent', TRACK_BY_SCHEMA[s.track]?.color)}>
              {s.track}
            </Badge>
          )}
          {s.type && <Badge>{s.type}</Badge>}
          {s.level && <Badge>{s.level}</Badge>}
          {s.tags?.map((t) => (
            <Badge key={t}>#{t}</Badge>
          ))}
        </div>
        {s.abstractHtml && (
          <div
            className="prose prose-sm mt-8 max-w-none text-kcd-ink"
            dangerouslySetInnerHTML={{ __html: s.abstractHtml }}
          />
        )}
        {sessionSpeakers.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-kcd-muted">Speakers</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {sessionSpeakers.map((sp) => (
                <li key={sp.slug}>
                  <Link
                    href={`/speakers/${sp.slug}`}
                    className="flex items-center gap-4 rounded-xl border border-kcd-border bg-white p-4 transition-shadow hover:shadow-card"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-kcd-subtle">
                      {sp.photoUrl ? (
                        <Image
                          src={sp.photoUrl}
                          alt={sp.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg font-semibold text-kcd-muted">
                          {sp.name
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-kcd-ink">{sp.name}</p>
                      {(sp.role || sp.company) && (
                        <p className="mt-1 text-sm text-kcd-muted">
                          {[sp.role, sp.company].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </Container>
  );
}
