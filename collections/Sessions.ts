import type { CollectionConfig } from 'payload';
import { revalidateAfterChange } from '../lib/payload-hooks';

export const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'track', 'start'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateAfterChange((doc) => [`/schedule/${doc.slug}`, '/schedule', '/'])],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'abstract', type: 'textarea' },
    { name: 'speakers', type: 'relationship', relationTo: 'speakers', hasMany: true },
    {
      name: 'track',
      type: 'select',
      options: ['Platform', 'DevSecOps', 'AI/ML', 'Networking', 'Beginner'].map((v) => ({ label: v, value: v })),
    },
    {
      name: 'type',
      type: 'select',
      options: ['Talk', 'Workshop', 'Lightning', 'Panel', 'Keynote'].map((v) => ({ label: v, value: v })),
    },
    { name: 'durationMinutes', type: 'number', defaultValue: 30 },
    { name: 'start', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'room', type: 'text' },
    {
      name: 'level',
      type: 'select',
      options: ['Beginner', 'Intermediate', 'Advanced'].map((v) => ({ label: v, value: v })),
    },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
  ],
};
