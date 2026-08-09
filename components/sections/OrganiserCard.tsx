'use client';

import * as React from 'react';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/ui/social-icons';
import { Dialog } from '@/components/ui/dialog';
import { ButtonLink } from '@/components/ui/button';
import type { TeamMember } from '@/lib/content';

export function OrganiserCard({ member }: { member: TeamMember }) {
  const [open, setOpen] = React.useState(false);
  const titleId = `organiser-${member.slug}`;
  const bodyId = `organiser-${member.slug}-body`;
  const roleLine = [member.role, member.company].filter(Boolean).join(' · ');
  const socials = member.socials ?? {};

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group block h-full w-full overflow-hidden rounded-3xl border border-kcd-border bg-white text-left shadow-card transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kcd-primary"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-kcd-primary/20 via-kcd-green/15 to-kcd-orange/20">
          {member.photoUrl && (
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              sizes="(min-width: 640px) 288px, 256px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ objectPosition: member.photoPosition ?? 'center top' }}
            />
          )}
        </div>
        <div className="p-5">
          <h4 className="font-display text-base font-semibold text-kcd-ink">{member.name}</h4>
          {roleLine && <p className="mt-1 text-sm text-kcd-ink/75">{roleLine}</p>}
        </div>
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} labelledBy={titleId} describedBy={bodyId}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {member.photoUrl && (
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-kcd-subtle">
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                sizes="112px"
                className="object-cover"
                style={{ objectPosition: member.photoPosition ?? 'center top' }}
              />
            </div>
          )}
          <div className="min-w-0 pr-8">
            <h3 id={titleId} className="font-display text-2xl font-bold text-kcd-ink">
              {member.name}
            </h3>
            {roleLine && <p className="mt-1 text-sm font-medium text-kcd-ink/80">{roleLine}</p>}
            {member.credentials && (
              <p className="mt-2 text-xs uppercase tracking-wide text-kcd-ink/55">{member.credentials}</p>
            )}
          </div>
        </div>

        {member.bioHtml && (
          <div
            id={bodyId}
            className="prose prose-sm mt-5 max-w-none text-kcd-ink/80"
            dangerouslySetInnerHTML={{ __html: member.bioHtml }}
          />
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {socials.linkedin && (
            <ButtonLink href={socials.linkedin} variant="primary" size="md">
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              Connect on LinkedIn
            </ButtonLink>
          )}
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${member.name} on GitHub`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-kcd-border text-kcd-ink/70 transition hover:bg-kcd-subtle hover:text-kcd-ink"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${member.name} on X`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-kcd-border text-kcd-ink/70 transition hover:bg-kcd-subtle hover:text-kcd-ink"
            >
              <Twitter className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          {socials.website && (
            <a
              href={socials.website}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${member.name} website`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-kcd-border text-kcd-ink/70 transition hover:bg-kcd-subtle hover:text-kcd-ink"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </Dialog>
    </>
  );
}
