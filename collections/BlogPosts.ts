import type { CollectionConfig } from 'payload';
import { revalidateAfterChange } from '../lib/payload-hooks';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publishedAt'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateAfterChange((doc) => [`/blog/${doc.slug}`, '/blog'])],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    { name: 'authors', type: 'relationship', relationTo: 'speakers', hasMany: true },
    { name: 'publishedAt', type: 'date' },
  ],
};
