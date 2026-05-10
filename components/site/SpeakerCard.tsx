import Image from 'next/image';
import Link from 'next/link';
import type { Speaker } from '@/lib/content';
import { Card } from '@/components/ui/card';

export function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <Link href={`/speakers/${speaker.slug}`} className="group block">
      <Card className="overflow-hidden">
        <div className="relative aspect-square w-full bg-kcd-subtle">
          {speaker.photoUrl ? (
            <Image
              src={speaker.photoUrl}
              alt={`Photo of ${speaker.name}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-kcd-ink group-hover:text-kcd-primary">{speaker.name}</h3>
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
