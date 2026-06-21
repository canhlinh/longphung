import type { CollectionConfig } from 'payload'

import { admins, publishedOrAdmin } from '@/access/admins'
import { slugify } from '@/lib/slugify'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    defaultColumns: ['title', 'featured', '_status'],
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Slug generated only if absent. Title changes do not auto-regenerate to protect URLs.
        if (data?.title && !data.slug) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      hasMany: true,
      relationTo: 'products',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
