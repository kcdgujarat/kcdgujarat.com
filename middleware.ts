import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COMING_SOON = process.env.NEXT_PUBLIC_COMING_SOON === 'true';

/** Internal rewrite target — must stay reachable while coming-soon mode is on. */
const COMING_SOON_NOT_FOUND = '/__coming_soon_not_found__';

function isAllowedDuringComingSoon(pathname: string): boolean {
  if (pathname === '/' || pathname === COMING_SOON_NOT_FOUND) return true;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images/') ||
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

export function middleware(request: NextRequest) {
  if (!COMING_SOON) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (isAllowedDuringComingSoon(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = COMING_SOON_NOT_FOUND;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
