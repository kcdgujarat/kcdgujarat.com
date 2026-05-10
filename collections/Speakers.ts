import type { CollectionConfig } from 'payload';
import { revalidateAfterChange } from '../lib/payload-hooks';

export const Speakers: CollectionConfig = {
  slug: 'speakers',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'company', 'featured'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateAfterChange((doc) => [`/speakers/${doc.slug}`, '/speakers', '/'])],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'github', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },
    { name: 'sessions', type: 'relationship', relationTo: 'sessions', hasMany: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
};
