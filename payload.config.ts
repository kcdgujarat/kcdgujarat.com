import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Speakers } from './collections/Speakers';
import { Sessions } from './collections/Sessions';
import { Sponsors } from './collections/Sponsors';
import { FAQs } from './collections/FAQs';
import { BlogPosts } from './collections/BlogPosts';
import { Settings } from './collections/Settings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' — KCD Gujarat 2026 Admin',
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Speakers, Sessions, Sponsors, FAQs, BlogPosts],
  globals: [Settings],
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.POSTGRES_URL_NON_POOLING ||
        process.env.DATABASE_URL ||
        '',
    },
  }),
  plugins: blobToken
    ? [
        vercelBlobStorage({
          collections: { media: true },
          token: blobToken,
        }),
      ]
    : [],
  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
});
