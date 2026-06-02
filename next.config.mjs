import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, 'content');

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
