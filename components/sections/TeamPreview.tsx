import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { OrganisersGrid } from '@/components/sections/OrganisersGrid';
import type { TeamMember } from '@/lib/content';

interface Props {
  team: TeamMember[];
}

const GROUP_ORDER: TeamMember['group'][] = ['organizer', 'core', 'volunteer'];

export function TeamPreview({ team }: Props) {
  const groups = GROUP_ORDER.map((key) => ({
    key,
    members: team.filter((m) => m.group === key),
  })).filter((g) => g.members.length > 0);

  return (
    <section id="team" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Organisers"
          title="Meet the organisers"
          description="The passionate people behind KCD Gujarat 2026, working together to bring you an exceptional cloud-native experience."
          align="center"
        />

        {groups.length === 0 && (
          <p className="text-center text-sm text-kcd-ink/65">
            Organiser listing dropping soon. Add markdown files under <code>content/team/</code>.
          </p>
        )}

        <div className="space-y-12">
          {groups.map((g) => (
            <OrganisersGrid key={g.key} members={g.members} />
          ))}
        </div>
      </Container>
    </section>
  );
}
