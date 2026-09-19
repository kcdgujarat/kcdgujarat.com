import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/utils';

/**
 * AI / LLM crawlers, named explicitly so the policy is a decision rather than a
 * side effect of the `*` wildcard. We want the event discoverable in AI search,
 * so these are allowed; flip an entry to `disallow` to opt out of one.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'meta-externalagent',
  'Bytespider',
];

export default function robots(): MetadataRoute.Robots {
  // `/api/og` renders the Open Graph cards referenced from every page's metadata,
  // so it has to stay crawlable. The other two API routes are infrastructure.
  const disallow = ['/api/revalidate', '/api/health'];
  const allow = ['/', '/api/og'];

  return {
    rules: [
      { userAgent: '*', allow, disallow },
      { userAgent: AI_CRAWLERS, allow, disallow },
    ],
    sitemap: siteUrl('/sitemap.xml'),
    host: siteUrl('/'),
  };
}
