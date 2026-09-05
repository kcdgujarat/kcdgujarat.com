import { OrganiserCard } from '@/components/sections/OrganiserCard';
import type { TeamMember } from '@/lib/content';

export function OrganisersGrid({ members }: { members: TeamMember[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((m) => (
        <li key={m.slug}>
          <OrganiserCard member={m} />
        </li>
      ))}
    </ul>
  );
}
