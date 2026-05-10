import type { GlobalConfig } from 'payload';
import { revalidateAfterChangeGlobal } from '../lib/payload-hooks';

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateAfterChangeGlobal(['/'])],
  },
  fields: [
    { name: 'eventDate', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'eventEndDate', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'eventCity', type: 'text', defaultValue: 'Ahmedabad, Gujarat' },
    { name: 'venueName', type: 'text' },
    { name: 'venueAddress', type: 'textarea' },
    { name: 'mapEmbedUrl', type: 'text' },
    { name: 'registrationUrl', type: 'text' },
    { name: 'cfpUrl', type: 'text' },
    { name: 'heroHeadline', type: 'text' },
    { name: 'heroSubheadline', type: 'textarea' },
    { name: 'contactEmail', type: 'email' },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'github', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
  ],
};
