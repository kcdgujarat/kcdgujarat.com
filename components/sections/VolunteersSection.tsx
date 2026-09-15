import Image from 'next/image';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import type { TeamMember } from '@/lib/content';

interface Props {
  volunteers: TeamMember[];
}

export function VolunteersSection({ volunteers }: Props) {
  if (volunteers.length === 0) return null;

  return (
    <section id="volunteers" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Community"
          title="Meet the volunteers"
          description="The on-ground crew helping make KCD Gujarat 2026 a welcoming, well-run experience for everyone."
          align="center"
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {volunteers.map((member) => (
            <li key={member.slug}>
              <VolunteerCard member={member} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function VolunteerCard({ member }: { member: TeamMember }) {
  const roleLine = [member.role, member.company].filter(Boolean).join(' · ');

  return (
    <article className="overflow-hidden rounded-3xl border border-kcd-border bg-white shadow-card">
      <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-kcd-primary/20 via-kcd-green/15 to-kcd-orange/20">
        {member.photoUrl && (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-base font-semibold text-kcd-ink">{member.name}</h3>
        {roleLine && <p className="mt-1 text-sm text-kcd-ink/75">{roleLine}</p>}
      </div>
    </article>
  );
}
