import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { OrganisersGrid } from '@/components/sections/OrganisersGrid';
import type { TeamMember } from '@/lib/content';

interface Props {
  team: TeamMember[];
}

export function TeamPreview({ team }: Props) {
  const organisers = team.filter((m) => m.group === 'organizer' || m.group === 'core');

  return (
    <section id="team" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Organisers"
          title="Meet the organisers"
          description="The passionate people behind KCD Gujarat 2026, working together to bring you an exceptional cloud-native experience."
          align="center"
        />

        {organisers.length === 0 && (
          <p className="text-center text-sm text-kcd-ink/65">
            Organiser listing dropping soon. Add markdown files under <code>content/team/</code>.
          </p>
        )}

        {organisers.length > 0 && <OrganisersGrid members={organisers} />}
      </Container>
    </section>
  );
}
