import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import type { TeamMember } from '@/lib/content';

interface Props {
  team: TeamMember[];
  previewSize?: number;
}

const GROUPS: { key: TeamMember['group']; title: string; eyebrow: string }[] = [
  { key: 'organizer', title: 'Organizers', eyebrow: 'Core crew' },
  { key: 'core', title: 'Core Team', eyebrow: 'Track + program leads' },
  { key: 'volunteer', title: 'Volunteers', eyebrow: 'On-ground heroes' },
];

export function TeamPreview({ team, previewSize = 4 }: Props) {
  const grouped = GROUPS.map((g) => {
    const all = team.filter((m) => m.group === g.key);
    return {
      ...g,
      total: all.length,
      members: all.slice(0, previewSize),
      hasMore: all.length > previewSize,
    };
  }).filter((g) => g.total > 0);

  return (
    <section id="team" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Organizers"
          title="Meet the team"
          description="The passionate volunteers behind KCD Gujarat 2026, working together to bring you an exceptional cloud-native experience."
          align="center"
        />

        {grouped.length === 0 && (
          <p className="text-center text-sm text-kcd-ink/65">
            Team listing dropping soon. Add markdown files under <code>content/team/</code>.
          </p>
        )}

        <div className="space-y-12">
          {grouped.map((g) => (
            <div key={g.key}>
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-kcd-primary">
                    {g.eyebrow}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-kcd-ink sm:text-3xl">
                    {g.title}
                  </h3>
                </div>
                <p className="text-sm text-kcd-ink/60">{g.total} people</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {g.members.map((m) => (
                  <TeamCard key={m.slug} member={m} />
                ))}
              </div>
              {g.hasMore && (
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/team"
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-kcd-ink px-6 text-xs font-bold uppercase tracking-wider text-kcd-ink hover:bg-kcd-ink hover:!text-white"
                  >
                    See more {g.title.toLowerCase()} ({g.total - g.members.length} more)
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-kcd-border bg-white shadow-card">
      <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-kcd-primary/20 via-kcd-green/15 to-kcd-orange/20">
        {member.photoUrl && (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="p-5">
        <h4 className="font-display text-base font-semibold text-kcd-ink">{member.name}</h4>
        <p className="mt-1 text-sm text-kcd-ink/75">
          {member.role}
          {member.company ? ` · ${member.company}` : ''}
        </p>
        {member.credentials && (
          <p className="mt-2 text-xs text-kcd-ink/60">{member.credentials}</p>
        )}
      </div>
    </article>
  );
}
