import { getEventConfig } from '@/lib/content';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

/**
 * RFC 9116 security.txt.
 *
 * `Expires` is computed six months out rather than hard-coded: the RFC treats a
 * past `Expires` as invalid, and a literal date in a file nobody revisits is
 * guaranteed to rot. ISR re-renders this hourly, so it can never lapse.
 */
export async function GET() {
  const event = await getEventConfig();
  const contact = event.contactEmail;

  const expires = new Date();
  expires.setMonth(expires.getMonth() + 6);

  const lines = [
    '# Security contact for kcdgujarat.com (RFC 9116).',
    '# This is a community-run conference site. There is no bug bounty,',
    '# but we will read and act on anything you send.',
    '',
    `Contact: mailto:${contact}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    'Preferred-Languages: en',
    `Canonical: ${siteUrl('/.well-known/security.txt')}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
