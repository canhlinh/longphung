import type { CollectionConfig } from 'payload'

import { admins, publishedOrAdmin } from '@/access/admins'

export const Banners: CollectionConfig = {
  slug: 'banners',
  admin: {
    defaultColumns: ['title', 'placement', 'isActive', 'sortOrder', '_status'],
    useAsTitle: 'title',
  },
  access: {
    create: admins,
    delete: admins,
    read: publishedOrAdmin,
    update: admins,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'linkLabel',
      type: 'text',
    },
    {
      name: 'linkUrl',
      type: 'text',
    },
    {
      name: 'placement',
      type: 'select',
      defaultValue: 'home',
      options: [{ label: 'Trang chu', value: 'home' }],
      required: true,
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
