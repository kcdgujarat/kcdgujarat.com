import { NextResponse, type NextRequest } from 'next/server';

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

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Skip CSP on the Payload admin/api routes — Payload manages its own headers.
  const path = req.nextUrl.pathname;
  if (!path.startsWith('/admin') && !path.startsWith('/api')) {
    res.headers.set('Content-Security-Policy', CSP);
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
