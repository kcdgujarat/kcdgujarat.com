'use client';

import * as React from 'react';
import { OrganiserCard } from '@/components/sections/OrganiserCard';
import { Button } from '@/components/ui/button';
import type { TeamMember } from '@/lib/content';

export function OrganisersGrid({
  members,
  previewCount = 3,
}: {
  members: TeamMember[];
  previewCount?: number;
}) {
  const [showAll, setShowAll] = React.useState(false);
  const hasMore = members.length > previewCount;
  const visible = showAll ? members : members.slice(0, previewCount);

  return (
    <div>
      <ul className="mx-auto grid max-w-5xl items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((m) => (
          <li key={m.slug} className="min-w-0">
            <OrganiserCard member={m} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
          >
            {showAll ? 'See less' : `See more (${members.length - previewCount} more)`}
          </Button>
        </div>
      )}
    </div>
  );
}
