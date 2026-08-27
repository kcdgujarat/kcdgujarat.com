import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, 'content');

/**
 * Ticketing URL for the `/register` redirect. `/register` is no longer a page —
 * it exists only as a redirect to the ticketing partner. Read from content so the
 * URL stays a content edit (CLAUDE.md 12: never hard-code registration URLs).
 */
function registrationUrl() {
  const file = path.join(contentDir, 'pages', 'registration.md');
  const url = matter(fs.readFileSync(file, 'utf8')).data?.url;
  if (typeof url !== 'string' || !/^https?:\/\//.test(url)) {
    throw new Error(`content/pages/registration.md: \`url\` must be an absolute http(s) URL (got ${JSON.stringify(url)})`);
  }
  return url;
}

/** Registers `content/` with webpack so `--webpack` dev recompiles on markdown edits. */
class WatchContentDirPlugin {
  apply(compiler) {
    compiler.hooks.afterCompile.tap('WatchContentDirPlugin', (compilation) => {
      compilation.contextDependencies.add(contentDir);
    });
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Dev content watcher uses webpack; production build uses Turbopack by default in Next 16.
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  webpack(config, { dev, isServer }) {
    if (dev && isServer) {
      config.plugins.push(new WatchContentDirPlugin());
    }
    return config;
  },
  async redirects() {
    // Skipped while coming-soon mode is on so `proxy.ts` can keep gating the path
    // (next.config redirects run before middleware).
    if (process.env.NEXT_PUBLIC_COMING_SOON === 'true') return [];
    return [
      {
        source: '/register',
        destination: registrationUrl(),
        // Not permanent: the ticketing partner/URL can change between editions.
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
