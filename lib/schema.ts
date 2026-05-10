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

export const BlogFrontmatter = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  cover: z.string().optional(),
  authors: z.array(z.string()).optional().default([]),
  publishedAt: z.string().optional(),
});
export type BlogFrontmatter = z.infer<typeof BlogFrontmatter>;
