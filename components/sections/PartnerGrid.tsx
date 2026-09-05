'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CommunityPartnerCard } from '@/components/sections/CommunityPartnerCard';
import type { Partner } from '@/lib/content';

export function PartnerGrid({
  partners,
  previewCount = 8,
}: {
  partners: Partner[];
  previewCount?: number;
}) {
  const [showAll, setShowAll] = React.useState(false);
  const hasMore = partners.length > previewCount;
  const visible = showAll ? partners : partners.slice(0, previewCount);

  return (
    <div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p) => (
          <li key={p.slug}>
            <CommunityPartnerCard partner={p} />
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
            {showAll ? 'Show less' : 'Show more'}
          </Button>
        </div>
      )}
    </div>
  );
}
