import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { buildMetadata } from '@/lib/seo';
import { getEventConfig, getTeam, type TeamMember } from '@/lib/content';

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Team',
  path: '/team',
  description: 'The organizers and volunteers behind KCD Gujarat 2026.',
});

const GROUPS: { key: TeamMember['group']; title: string; eyebrow: string; anchor: string }[] = [
  { key: 'organizer', title: 'Organizers', eyebrow: 'Core crew', anchor: 'organizers' },
  { key: 'core', title: 'Core Team', eyebrow: 'Track + program leads', anchor: 'core' },
  { key: 'volunteer', title: 'Volunteers', eyebrow: 'On-ground heroes', anchor: 'volunteers' },
];

export default async function TeamPage() {
  const event = await getEventConfig();
  if (!event.showTeam) notFound();

  const team = await getTeam();
  const grouped = GROUPS.map((g) => ({
    ...g,
    members: team.filter((m) => m.group === g.key),
  })).filter((g) => g.members.length > 0);

  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Team"
        title="Organizers and volunteers"
        description="The passionate volunteers behind KCD Gujarat 2026. Want to help? Get in touch."
      />

      {team.length === 0 && (
        <p className="text-sm text-kcd-ink/65">
          Team listing dropping soon. Add markdown files under <code>content/team/</code>.
        </p>
      )}

      <div className="space-y-16">
        {grouped.map((g) => (
          <section key={g.key} id={g.anchor} className="scroll-mt-28">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-kcd-primary">
                  {g.eyebrow}
                </p>
                <h2 className="font-display text-2xl font-bold text-kcd-ink sm:text-3xl">
                  {g.title}
                </h2>
              </div>
              <p className="text-sm text-kcd-ink/60">{g.members.length} people</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {g.members.map((m) => (
                <article key={m.slug} className="overflow-hidden rounded-3xl border border-kcd-border bg-white shadow-card">
                  <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-kcd-primary/20 via-kcd-green/15 to-kcd-orange/20">
                    {m.photoUrl && (
                      <Image
                        src={m.photoUrl}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-kcd-ink">{m.name}</h3>
                    <p className="mt-1 text-sm text-kcd-ink/75">
                      {m.role}
                      {m.company ? ` · ${m.company}` : ''}
                    </p>
                    {m.credentials && (
                      <p className="mt-2 text-xs text-kcd-ink/60">{m.credentials}</p>
                    )}
                    {(m.socials?.twitter || m.socials?.linkedin || m.socials?.github) && (
                      <ul className="mt-3 flex items-center gap-3 text-xs font-semibold text-kcd-primary">
                        {m.socials?.twitter && (
                          <li>
                            <a href={m.socials.twitter} target="_blank" rel="noreferrer">
                              X / Twitter
                            </a>
                          </li>
                        )}
                        {m.socials?.linkedin && (
                          <li>
                            <a href={m.socials.linkedin} target="_blank" rel="noreferrer">
                              LinkedIn
                            </a>
                          </li>
                        )}
                        {m.socials?.github && (
                          <li>
                            <a href={m.socials.github} target="_blank" rel="noreferrer">
                              GitHub
                            </a>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
