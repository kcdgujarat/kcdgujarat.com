import { z } from 'zod';
import { normalizeSiteSocialLinks } from '@/lib/site-social';
import {
  isDateTimeRangeActive,
  isRegistrationWindowActive,
  getDateTimeWindowPhase,
  getRegistrationWindowPhase,
} from '@/lib/utils';

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
  /** Must match a `schema` value in lib/tracks.ts. */
  track: z
    .enum([
      'Platform Engineering',
      'Application Development + Delivery',
      'Operations + Performance',
      'Observability',
      'Security',
      'Connectivity',
      'AI Inference + Agentic',
      'Cloud Native Experience',
      'Emerging + Advanced',
    ])
    .optional(),
  type: z.enum(['Talk', 'Lightning', 'Panel', 'Keynote']).optional().default('Talk'),
  durationMinutes: z.number().optional().default(30),
  start: z.string().optional(),
  room: z.string().optional(),
  level: z.enum(['All levels', 'Beginner', 'Intermediate', 'Advanced']).optional(),
  tags: z.array(z.string()).optional().default([]),
});
export type SessionFrontmatter = z.infer<typeof SessionFrontmatter>;

export const SponsorFrontmatter = RenderFlag.extend({
  name: z.string(),
  tier: z.enum(['platinum', 'gold', 'silver', 'community', 'diversity', 'media']),
  logo: z.string().optional(),
  url: z.string().url(),
  order: z.number().optional().default(100),
  description: z.string().optional(),
});
export type SponsorFrontmatter = z.infer<typeof SponsorFrontmatter>;

export const FaqFrontmatter = RenderFlag.extend({
  question: z.string(),
  /** Heading the question is grouped under on `/faq` (e.g. General, Registration, CFP). */
  section: z.string().optional().default('General'),
  /** When `true`, also surfaced in the curated homepage `/#faq` accordion. */
  featured: z.boolean().optional().default(false),
  order: z.number().optional().default(100),
});
export type FaqFrontmatter = z.infer<typeof FaqFrontmatter>;

export const CfpFormatIcon = z.enum(['megaphone', 'wrench', 'graduation-cap', 'users', 'group']);
export type CfpFormatIcon = z.infer<typeof CfpFormatIcon>;

export const CfpHomeFormatCard = z.object({
  icon: CfpFormatIcon.default('megaphone'),
  title: z.string(),
  description: z.string(),
});
export type CfpHomeFormatCard = z.infer<typeof CfpHomeFormatCard>;

const CFP_HOME_DEFAULTS = {
  eyebrow: 'CFP',
  title: 'Call for Proposals',
  description:
    'We are looking for talks, panels, and lightning sessions across our tracks. First-time speakers warmly encouraged.',
  cards: [
    {
      icon: 'megaphone' as const,
      title: 'Talks',
      description: '25-minute sessions sharing real-world experience and lessons learned.',
    },
    {
      icon: 'graduation-cap' as const,
      title: 'Lightning',
      description: 'Ten-minute talks. Great for first-time speakers.',
    },
    {
      icon: 'group' as const,
      title: 'Panel Discussion',
      description:
        'Panel discussions among multiple speakers exploring a focused topic from different perspectives.',
    },
  ],
};

/** Homepage `/#cfp` section — partial fields fall back to defaults. */
export const CfpHomeSection = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    cards: z.array(CfpHomeFormatCard).optional(),
  })
  .transform((partial) => ({
    eyebrow: partial.eyebrow ?? CFP_HOME_DEFAULTS.eyebrow,
    title: partial.title ?? CFP_HOME_DEFAULTS.title,
    description: partial.description ?? CFP_HOME_DEFAULTS.description,
    cards: partial.cards ?? CFP_HOME_DEFAULTS.cards,
  }));
export type CfpHomeSection = z.infer<typeof CfpHomeSection>;

/** 24-hour clock, Asia/Kolkata wall time unless `timezone` is set. */
export const TimeOfDay = z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, {
  message: 'Use 24-hour HH:mm (e.g. 09:00, 18:30)',
});

export const CfpConfigFrontmatter = z
  .object({
    /** First day the CFP opens (YYYY-MM-DD). */
    startDate: z.string(),
    /** Optional opening time on `startDate` (HH:mm, 24h). Defaults to 00:00. */
    startTime: TimeOfDay.optional(),
    /** Last day submissions are accepted (YYYY-MM-DD). */
    endDate: z.string(),
    /** Optional closing time on `endDate` (HH:mm, 24h). Defaults to 23:59 inclusive. */
    endTime: TimeOfDay.optional(),
    /** IANA timezone for the window. Defaults to Asia/Kolkata. */
    timezone: z.string().optional().default('Asia/Kolkata'),
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
        'We are looking for talks, panels, and lightning sessions across the cloud native ecosystem — from platform engineering and security to observability, connectivity, and AI.',
      ),
    /** Homepage `/#cfp` anchor section (eyebrow, title, intro, format cards). */
    homeSection: CfpHomeSection.optional(),
  })
  .transform((data) => {
    const window = {
      startTime: data.startTime,
      endTime: data.endTime,
      timeZone: data.timezone,
    };
    return {
      ...data,
      homeSection: data.homeSection ?? CfpHomeSection.parse({}),
      open: isDateTimeRangeActive(data.startDate, data.endDate, window),
      phase: getDateTimeWindowPhase(data.startDate, data.endDate, window),
      /** Alias kept for components that display the submission deadline. */
      deadline: data.endDate,
    };
  });
export type CfpConfigFrontmatter = z.infer<typeof CfpConfigFrontmatter>;

/**
 * A non-session item on the conference day — registration, breaks, sponsor
 * slots, ceremonies. Sessions come from `content/sessions`; everything the
 * agenda needs that no session describes is listed here.
 */
export const TimelineItem = RenderFlag.extend({
  time: TimeOfDay,
  /** End of the item. Omit for a marker with no length (e.g. "Event Ends"). */
  endTime: TimeOfDay.optional(),
  label: z.string(),
  icon: z.string().optional().default('📌'),
  /** Set only when the item occupies one hall while the other runs sessions. */
  room: z.string().optional(),
  /** Include in the homepage "Day at a Glance" summary — minor items opt out. */
  glance: z.boolean().optional().default(true),
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

/** Transport mode for a `venueTravel` row — maps to a lucide icon on `/venue`. */
export const VenueTravelIcon = z.enum(['plane', 'bus', 'train', 'car', 'metro']);
export type VenueTravelIcon = z.infer<typeof VenueTravelIcon>;

/**
 * One "how far is it from…" row on `/venue`. `distanceKm` and `driveMinutes`
 * are road numbers, not straight lines — quote them as approximate, because
 * Ahmedabad traffic makes any single figure a lie at some hour of the day.
 */
export const VenueTravelItem = RenderFlag.extend({
  /** Origin as a traveller would name it, e.g. "Ahmedabad Airport (SVPI)". */
  from: z.string(),
  icon: VenueTravelIcon.default('car'),
  distanceKm: z.number().positive(),
  /** Typical door-to-door drive, allowing for traffic. */
  driveMinutes: z.number().positive().optional(),
  /** One line of practical advice — which terminal, which side, what to book. */
  note: z.string().optional(),
  order: z.number().optional().default(100),
});
export type VenueTravelItem = z.infer<typeof VenueTravelItem>;

/** A venue photo. `alt` is required — a decorative venue shot is still content. */
export const VenuePhoto = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  /** Optional caption printed under the photo in the gallery. */
  caption: z.string().optional(),
  /**
   * Intrinsic pixel size. Supply **both** and the lightbox sizes the photo to
   * its own aspect ratio, so there is no dead space around it; omit them and it
   * falls back to a fixed-height `object-contain` box, which is correct but
   * letterboxes. The on-page tiles crop with `object-cover` either way.
   */
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type VenuePhoto = z.infer<typeof VenuePhoto>;

export const EventConfigFrontmatter = z.object({
  headline: z.string().optional(),
  eventDate: z.string().optional(),
  eventEndDate: z.string().optional(),
  city: z.string().optional().default('Gujarat, India'),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  /** The venue's own site, linked from `/venue` for rooms and enquiries. */
  venueUrl: optionalUrl,
  /** Deep link that opens the venue in the visitor's maps app. */
  venueDirectionsUrl: optionalUrl,
  /** `[latitude, longitude]` — feeds the JSON-LD `Place.geo`. */
  venueCoordinates: z.tuple([z.number(), z.number()]).optional(),
  venuePhotos: z.array(VenuePhoto).optional().default([]),
  venueTravel: z.array(VenueTravelItem).optional().default([]),
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
  /** `package` = priced headline tier; `additional` = add-on / in-kind opportunity. */
  group: z.enum(['package', 'additional']).default('package'),
});
export type SponsorshipTier = z.infer<typeof SponsorshipTier>;

/** A "why sponsor" reason card. */
export const SponsorshipReason = z.object({
  title: z.string(),
  description: z.string().default(''),
});
export type SponsorshipReason = z.infer<typeof SponsorshipReason>;

export const SponsorshipConfigFrontmatter = z.object({
  contactEmail: z.union([z.string().email(), z.literal('')]).optional(),
  /** PDF filename under `static/` (defaults to prospectus.pdf when present). */
  prospectus: z.string().optional(),
  /** Optional full URL override; takes precedence over `prospectus`. */
  prospectusUrl: z.union([z.string().url(), z.literal('')]).optional(),
  /** Lead-in pitch shown under the page title. */
  intro: z.string().optional(),
  /** "Why sponsor" reason cards. */
  reasons: z.array(SponsorshipReason).optional(),
  /** "Who you'll reach" audience bullet points. */
  audience: z.array(z.string()).optional(),
  /** Optional contract deadline note (e.g. "Signed contracts due 15 August 2026"). */
  deadline: z.string().optional(),
  /** Short sponsor terms / code-of-conduct note shown at the foot of the page. */
  terms: z.string().optional(),
  tiers: z.array(SponsorshipTier).default([]),
});
export type SponsorshipConfigFrontmatter = z.infer<typeof SponsorshipConfigFrontmatter>;

export const RegistrationConfigFrontmatter = z
  .object({
    /** First day registration opens (YYYY-MM-DD). */
    startDate: z.string(),
    /** Optional opening time on `startDate` (HH:mm, 24h). Defaults to 00:00. */
    startTime: TimeOfDay.optional(),
    /** Optional last day registration stays open (YYYY-MM-DD). */
    endDate: z.string().optional(),
    /** Optional closing time on `endDate` (HH:mm, 24h). Defaults to 23:59 inclusive. */
    endTime: TimeOfDay.optional(),
    /** IANA timezone for the window. Defaults to Asia/Kolkata. */
    timezone: z.string().optional().default('Asia/Kolkata'),
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
  .transform((data) => {
    const window = {
      startTime: data.startTime,
      endTime: data.endTime,
      timeZone: data.timezone,
    };
    return {
      ...data,
      open: isRegistrationWindowActive(data.startDate, data.endDate, window),
      phase: getRegistrationWindowPhase(data.startDate, data.endDate, window),
    };
  });
export type RegistrationConfigFrontmatter = z.infer<typeof RegistrationConfigFrontmatter>;

export const PartnerFrontmatter = RenderFlag.extend({
  name: z.string(),
  description: z.string().optional(),
  /** Partner category — drives the section a partner is grouped under. */
  type: z.enum(['cloud-native', 'community', 'media', 'venue']).optional().default('community'),
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

