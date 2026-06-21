import type { CollectionConfig } from 'payload'

import { admins, anyone } from '@/access/admins'
import { slugify } from '@/lib/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    defaultColumns: ['name', 'slug', 'featured', 'sortOrder'],
    useAsTitle: 'name',
  },
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data.slug) {
          data.slug = slugify(data.name)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
