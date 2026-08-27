import Image from 'next/image';
import Link from 'next/link';
import type { Speaker } from '@/lib/content';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function SpeakerCard({ speaker }: { speaker: Speaker }) {
  // Keynote speakers get a ring *and* a labelled badge — the tint alone would
  // be state-by-colour (CLAUDE.md §8.3).
  const keynote = speaker.keynote;
  return (
    <Link href={`/speakers/${speaker.slug}`} className="group block h-full">
      <Card
        className={cn(
          'flex h-full flex-col overflow-hidden',
          keynote && 'border-kcd-primary/40 ring-1 ring-kcd-primary/30',
        )}
      >
        <div className="relative aspect-square w-full bg-kcd-subtle">
          {speaker.photoUrl ? (
            <Image
              src={speaker.photoUrl}
              alt={`Photo of ${speaker.name}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl font-semibold text-kcd-muted">
              {speaker.name
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')}
            </div>
          )}
          {keynote && (
            <span className="absolute left-3 top-3 rounded-full bg-kcd-navy px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-card">
              Keynote
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-base font-semibold text-kcd-ink group-hover:text-kcd-primary">
            {speaker.name}
          </h3>
          {(speaker.role || speaker.company) && (
            <p className="mt-1 text-sm text-kcd-muted">
              {[speaker.role, speaker.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
