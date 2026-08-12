// Single source of truth for conference tracks.
// `schema` matches the SessionFrontmatter.track enum in lib/schema.ts —
// markdown sessions tag a talk with that exact string. Track names mirror the
// CFP categories verbatim, so `label` is the same string. Update both
// Schedule + DayAtGlance by editing this list.

export const TRACKS = [
  {
    id: '01',
    schema: 'Platform Engineering',
    label: 'Platform Engineering',
    color: 'bg-kcd-primary/10 text-blue-700',
  },
  {
    id: '02',
    schema: 'Application Development + Delivery',
    label: 'Application Development + Delivery',
    color: 'bg-indigo-500/10 text-indigo-700',
  },
  {
    id: '03',
    schema: 'Operations + Performance',
    label: 'Operations + Performance',
    color: 'bg-kcd-green/15 text-kcd-green',
  },
  {
    id: '04',
    schema: 'Observability',
    label: 'Observability',
    color: 'bg-teal-500/10 text-teal-700',
  },
  {
    id: '05',
    schema: 'Security',
    label: 'Security',
    color: 'bg-red-500/10 text-red-700',
  },
  {
    id: '06',
    schema: 'Connectivity',
    label: 'Connectivity',
    color: 'bg-cyan-500/10 text-cyan-800',
  },
  {
    id: '07',
    schema: 'AI Inference + Agentic',
    label: 'AI Inference + Agentic',
    color: 'bg-kcd-orange/15 text-orange-700',
  },
  {
    id: '08',
    schema: 'Cloud Native Experience',
    label: 'Cloud Native Experience',
    color: 'bg-kcd-yellow/20 text-amber-800',
  },
  {
    id: '09',
    schema: 'Emerging + Advanced',
    label: 'Emerging + Advanced',
    color: 'bg-kcd-ink/10 text-kcd-ink',
  },
] as const;

export type TrackSchema = (typeof TRACKS)[number]['schema'];

export const TRACK_BY_SCHEMA: Record<string, (typeof TRACKS)[number]> = Object.fromEntries(
  TRACKS.map((t) => [t.schema, t]),
);
