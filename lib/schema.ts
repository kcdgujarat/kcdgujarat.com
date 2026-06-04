import { z } from 'zod';
import { normalizeSiteSocialLinks } from '@/lib/site-social';
import { isDateRangeActive, isRegistrationWindowActive, getWindowPhase } from '@/lib/utils';

/** When `false`, the entry stays in Git but is hidden on the site. Defaults to `true`. */
export const RenderFlag = z.object({
  render: z.boolean().optional().default(true),
});
export type RenderFlag = z.infer<typeof RenderFlag>;

export function isPublished(entry: { render?: boolean }): boolean {
  return entry.render !== false;
}

export const SpeakerFrontmatter = RenderFlag.extend({
  name: z.string(),
  role: z.string().optional().default(''),
  company: z.string().optional().default(''),
  photo: z.string().optional(),
  socials: z
    .object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .partial()
    .optional()
    .default({}),
  sessions: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  order: z.number().optional().default(100),
});
export type SpeakerFrontmatter = z.infer<typeof SpeakerFrontmatter>;

export const SessionFrontmatter = RenderFlag.extend({
  title: z.string(),
  speakers: z.array(z.string()).optional().default([]),
  track: z.enum(['Platform', 'DevSecOps', 'AI/ML', 'Networking', 'Beginner']).optional(),
  type: z.enum(['Talk', 'Workshop', 'Lightning', 'Panel', 'Keynote']).optional().default('Talk'),
  durationMinutes: z.number().optional().default(30),
  start: z.string().optional(),
  room: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  tags: z.array(z.string()).optional().default([]),
});
export type SessionFrontmatter = z.infer<typeof SessionFrontmatter>;

export const SponsorFrontmatter = RenderFlag.extend({
  name: z.string(),
  tier: z.enum(['diamond', 'platinum', 'gold', 'silver', 'community', 'media']),
  logo: z.string().optional(),
  url: z.string().url(),
  order: z.number().optional().default(100),
  description: z.string().optional(),
});
export type SponsorFrontmatter = z.infer<typeof SponsorFrontmatter>;

export const FaqFrontmatter = RenderFlag.extend({
  question: z.string(),
  order: z.number().optional().default(100),
});
export type FaqFrontmatter = z.infer<typeof FaqFrontmatter>;

export const CfpConfigFrontmatter = z
  .object({
    /** First day the CFP is open (YYYY-MM-DD, Asia/Kolkata). */
    startDate: z.string(),
    /** Last day submissions are accepted (YYYY-MM-DD, Asia/Kolkata). */
    endDate: z.string(),
    url: z.string().url().optional(),
    announcedAt: z.string().optional(),
    /** Show the speaker lineup on the home page and in the nav, independent of CFP state. */
    showSpeakers: z.boolean().default(false),
    /** /cfp page header copy */
    eyebrow: z.string().optional().default('CFP'),
    title: z.string().optional().default('Call for Proposals'),
    description: z
      .string()
      .optional()
      .default(
        'We are looking for talks, workshops, and lightning sessions across Platform, DevSecOps, AI/ML, Networking, and Beginner tracks.',
      ),
  })
  .transform((data) => ({
    ...data,
    open: isDateRangeActive(data.startDate, data.endDate),
    phase: getWindowPhase(data.startDate, data.endDate),
    /** Alias kept for components that display the submission deadline. */
    deadline: data.endDate,
  }));
export type CfpConfigFrontmatter = z.infer<typeof CfpConfigFrontmatter>;

export const TimelineItem = RenderFlag.extend({
  time: z.string(),
  label: z.string(),
  icon: z.string().optional().default('📌'),
});
export type TimelineItem = z.infer<typeof TimelineItem>;

const optionalUrl = z.union([z.string().url(), z.literal('')]).optional();

/** Official site social profiles — edit `content/pages/social.md`. */
export const SocialLinksFrontmatter = z
  .object({
    x: optionalUrl,
    /** Legacy alias for `x`. */
    twitter: optionalUrl,
    linkedin: optionalUrl,
    instagram: optionalUrl,
    github: optionalUrl,
    youtube: optionalUrl,
  })
  .partial()
  .transform((data) => normalizeSiteSocialLinks(data));
export type SocialLinksFrontmatter = z.infer<typeof SocialLinksFrontmatter>;

export const EventConfigFrontmatter = z.object({
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  eventDate: z.string().optional(),
  eventEndDate: z.string().optional(),
  city: z.string().optional().default('Gujarat, India'),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  contactEmail: z.union([z.string().email(), z.literal('')]).optional(),
  /** Home `#team` section, header/footer Team links, and `/team` route. */
  showTeam: z.boolean().default(false),
  timeline: z.array(TimelineItem).optional(),
});
export type EventConfigFrontmatter = z.infer<typeof EventConfigFrontmatter>;

export const SponsorshipTier = RenderFlag.extend({
  name: z.string(),
  /** Package identifier for the prospectus page (kebab-case, e.g. bronze, diversity). */
  slug: z.string().min(1),
  price: z.string().optional().default(''),
  perks: z.array(z.string()).default([]),
});
export type SponsorshipTier = z.infer<typeof SponsorshipTier>;

export const SponsorshipConfigFrontmatter = z.object({
  contactEmail: z.union([z.string().email(), z.literal('')]).optional(),
  /** PDF filename under `static/` (defaults to prospectus.pdf when present). */
  prospectus: z.string().optional(),
  /** Optional full URL override; takes precedence over `prospectus`. */
  prospectusUrl: z.union([z.string().url(), z.literal('')]).optional(),
  tiers: z.array(SponsorshipTier).default([]),
});
export type SponsorshipConfigFrontmatter = z.infer<typeof SponsorshipConfigFrontmatter>;

export const RegistrationConfigFrontmatter = z
  .object({
    /** First day registration opens (YYYY-MM-DD, Asia/Kolkata). */
    startDate: z.string(),
    /** Optional last day registration stays open (YYYY-MM-DD, Asia/Kolkata). */
    endDate: z.string().optional(),
    /** URL for the ticketing platform. */
    url: z.string().url().optional(),
    /** /register page header copy */
    eyebrow: z.string().optional().default('Register'),
    title: z.string().optional().default('Reserve your seat'),
    description: z
      .string()
      .optional()
      .default('Tickets are issued via our ticketing partner. Click below to continue.'),
  })
  .transform((data) => ({
    ...data,
    open: isRegistrationWindowActive(data.startDate, data.endDate),
    phase: getWindowPhase(data.startDate, data.endDate),
  }));
export type RegistrationConfigFrontmatter = z.infer<typeof RegistrationConfigFrontmatter>;

export const KeyDatesFrontmatter = z.object({
  items: z
    .array(
      RenderFlag.extend({
        label: z.string(),
        value: z.string(),
      }),
    )
    .default([]),
});
export type KeyDatesFrontmatter = z.infer<typeof KeyDatesFrontmatter>;

export const PartnerFrontmatter = RenderFlag.extend({
  name: z.string(),
  description: z.string(),
  url: z.string().url().optional(),
  logo: z.string().optional(),
  order: z.number().optional().default(100),
});
export type PartnerFrontmatter = z.infer<typeof PartnerFrontmatter>;

export const TeamFrontmatter = RenderFlag.extend({
  name: z.string(),
  role: z.string().optional().default(''),
  company: z.string().optional().default(''),
  group: z.enum(['organizer', 'core', 'volunteer']).optional().default('volunteer'),
  credentials: z.string().optional().default(''),
  photo: z.string().optional(),
  socials: z
    .object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .partial()
    .optional()
    .default({}),
  order: z.number().optional().default(100),
});
export type TeamFrontmatter = z.infer<typeof TeamFrontmatter>;

