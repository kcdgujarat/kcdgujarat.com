import { z } from 'zod';

export const SpeakerFrontmatter = z.object({
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

export const SessionFrontmatter = z.object({
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

export const SponsorFrontmatter = z.object({
  name: z.string(),
  tier: z.enum(['diamond', 'platinum', 'gold', 'silver', 'community', 'media']),
  logo: z.string().optional(),
  url: z.string().url(),
  order: z.number().optional().default(100),
  description: z.string().optional(),
});
export type SponsorFrontmatter = z.infer<typeof SponsorFrontmatter>;

export const FaqFrontmatter = z.object({
  question: z.string(),
  order: z.number().optional().default(100),
});
export type FaqFrontmatter = z.infer<typeof FaqFrontmatter>;

export const CfpConfigFrontmatter = z.object({
  open: z.boolean().default(true),
  deadline: z.string().optional(),
  url: z.string().url().optional(),
  announcedAt: z.string().optional(),
  /** Show the speaker lineup on the home page and in the nav, independent of CFP state. */
  showSpeakers: z.boolean().default(false),
});
export type CfpConfigFrontmatter = z.infer<typeof CfpConfigFrontmatter>;

export const TimelineItem = z.object({
  time: z.string(),
  label: z.string(),
  icon: z.string().optional().default('📌'),
});
export type TimelineItem = z.infer<typeof TimelineItem>;

export const EventConfigFrontmatter = z.object({
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  eventDate: z.string().optional(),
  eventEndDate: z.string().optional(),
  city: z.string().optional().default('Gujarat, India'),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  timeline: z.array(TimelineItem).optional(),
});
export type EventConfigFrontmatter = z.infer<typeof EventConfigFrontmatter>;

export const SponsorshipTier = z.object({
  name: z.string(),
  slug: z.enum(['diamond', 'platinum', 'gold', 'silver', 'community', 'media']),
  price: z.string().optional().default(''),
  perks: z.array(z.string()).default([]),
});
export type SponsorshipTier = z.infer<typeof SponsorshipTier>;

export const SponsorshipConfigFrontmatter = z.object({
  contactEmail: z.string().email().optional(),
  prospectusUrl: z.string().url().optional(),
  tiers: z.array(SponsorshipTier).default([]),
});
export type SponsorshipConfigFrontmatter = z.infer<typeof SponsorshipConfigFrontmatter>;

export const RegistrationConfigFrontmatter = z.object({
  /** Show registration buttons and the /register page CTA. */
  open: z.boolean().default(false),
  /** URL for the ticketing platform. */
  url: z.string().url().optional(),
});
export type RegistrationConfigFrontmatter = z.infer<typeof RegistrationConfigFrontmatter>;

export const KeyDatesFrontmatter = z.object({
  items: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .default([]),
});
export type KeyDatesFrontmatter = z.infer<typeof KeyDatesFrontmatter>;

export const PartnerFrontmatter = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string().url().optional(),
  logo: z.string().optional(),
  order: z.number().optional().default(100),
});
export type PartnerFrontmatter = z.infer<typeof PartnerFrontmatter>;

export const TeamFrontmatter = z.object({
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

