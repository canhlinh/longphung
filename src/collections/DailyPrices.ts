import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'

export const DailyPrices: CollectionConfig = {
  slug: 'daily-prices',
  admin: {
    defaultColumns: ['date', 'product', 'displayName', 'price', 'isActive'],
    useAsTitle: 'displayName',
  },
  access: {
    create: admins,
    delete: admins,
    // Note: uses isActive flag instead of publishedOrAdmin/_status because this collection
    // intentionally has no versions/drafts (prices are time-bound records). (addresses Issue 24)
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }
      return {
        isActive: {
          equals: true,
        },
      }
    },
    update: admins,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'unit',
      type: 'select',
      defaultValue: 'kg',
      options: [
        { label: 'Kg', value: 'kg' },
        { label: 'Con', value: 'con' },
        { label: 'Thung', value: 'thung' },
        { label: 'Hop', value: 'hop' },
        { label: 'Set', value: 'set' },
      ],
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      required: true,
    },
    {
      name: 'wholesalePrice',
      type: 'number',
      min: 0,
    },
    {
      name: 'note',
      type: 'text',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
