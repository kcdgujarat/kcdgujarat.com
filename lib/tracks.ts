// Single source of truth for conference tracks.
// `schema` matches the SessionFrontmatter.track enum in lib/schema.ts —
// markdown sessions tag a talk with that exact string. `label` is the
// human-readable display name. Update both Schedule + DayAtGlance by
// editing this list.

export const TRACKS = [
  {
    id: '01',
    schema: 'Platform',
    label: 'Platform Engineering',
    color: 'bg-kcd-primary/10 text-kcd-primary',
  },
  {
    id: '02',
    schema: 'DevSecOps',
    label: 'DevSecOps & Security',
    color: 'bg-kcd-green/15 text-kcd-green',
  },
  {
    id: '03',
    schema: 'AI/ML',
    label: 'AI / ML',
    color: 'bg-kcd-orange/15 text-kcd-orange',
  },
  {
    id: '04',
    schema: 'Networking',
    label: 'Networking',
    color: 'bg-kcd-yellow/20 text-amber-700',
  },
  {
    id: '05',
    schema: 'Beginner',
    label: 'Beginner Track',
    color: 'bg-kcd-ink/10 text-kcd-ink',
  },
] as const;

export type TrackSchema = (typeof TRACKS)[number]['schema'];

export const TRACK_BY_SCHEMA: Record<string, (typeof TRACKS)[number]> = Object.fromEntries(
  TRACKS.map((t) => [t.schema, t]),
);
