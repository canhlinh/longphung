import type { GlobalConfig } from 'payload'

import { admins, anyone } from '@/access/admins'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'Long Phung Seafood',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Hai san tuoi moi ngay cho gia dinh va nha hang',
    },
    {
      name: 'hotline',
      type: 'text',
      defaultValue: '0900 000 000',
      required: true,
    },
    {
      name: 'zaloUrl',
      type: 'text',
      defaultValue: 'https://zalo.me/0900000000',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      defaultValue: 'Cap nhat dia chi cua Long Phung',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'facebookUrl',
      type: 'text',
    },
    {
      name: 'businessHours',
      type: 'text',
      defaultValue: '06:00 - 20:00 hang ngay',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Long Phung Seafood',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Hai san tuoi song, sashimi, combo gia dinh va bang gia moi ngay.',
        },
      ],
    },
  ],
}
