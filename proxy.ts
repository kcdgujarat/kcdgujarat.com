import { NextResponse, type NextRequest } from 'next/server';

const COMING_SOON = process.env.NEXT_PUBLIC_COMING_SOON === 'true';

/** Internal rewrite target — must stay reachable while coming-soon mode is on. */
const COMING_SOON_NOT_FOUND = '/__coming_soon_not_found__';

const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https://*.public.blob.vercel-storage.com https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https://www.google.com https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

function isAllowedDuringComingSoon(pathname: string): boolean {
  if (pathname === '/' || pathname === COMING_SOON_NOT_FOUND) return true;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/og/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return true;
  }

  // Infrastructure APIs only — not user-facing pages.
  if (
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/revalidate') ||
    pathname.startsWith('/api/og')
  ) {
    return true;
  }

  return false;
}

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (COMING_SOON && !isAllowedDuringComingSoon(path)) {
    const url = req.nextUrl.clone();
    url.pathname = COMING_SOON_NOT_FOUND;
    return NextResponse.rewrite(url);
  }

  const res = NextResponse.next();
  // Skip CSP on the Payload admin/api routes — Payload manages its own headers.
  if (!path.startsWith('/admin') && !path.startsWith('/api')) {
    res.headers.set('Content-Security-Policy', CSP);
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
