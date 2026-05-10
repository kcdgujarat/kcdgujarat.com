import type { CollectionConfig } from 'payload';
import { revalidateAfterChange } from '../lib/payload-hooks';

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'tier', 'order'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateAfterChange(() => ['/sponsors', '/'])],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: ['diamond', 'platinum', 'gold', 'silver', 'community', 'media'].map((v) => ({
        label: v,
        value: v,
      })),
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'url', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
};
