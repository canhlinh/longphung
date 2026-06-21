import type { CollectionConfig } from 'payload'

import { admins, publishedOrAdmin } from '@/access/admins'
import { slugify } from '@/lib/slugify'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    defaultColumns: ['name', 'category', 'retailPrice', 'stockStatus', '_status'],
    useAsTitle: 'name',
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
      ({ data, operation: _operation }) => {
        // Generate slug only when absent (on create or explicit clear).
        // Changing name does NOT auto-update slug to avoid breaking published permalinks.
        // See Issue 15 - admins can manually edit slug if needed.
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
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      maxRows: 8,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
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
      name: 'retailPrice',
      type: 'number',
      min: 0,
    },
    {
      name: 'wholesalePrice',
      type: 'number',
      min: 0,
    },
    {
      name: 'priceLabel',
      type: 'text',
      admin: {
        description: 'Use for flexible pricing such as "Lien he" or "Theo ngay".',
      },
    },
    {
      name: 'stockStatus',
      type: 'select',
      defaultValue: 'in_stock',
      options: [
        { label: 'Con hang', value: 'in_stock' },
        { label: 'Sap ve', value: 'preorder' },
        { label: 'Het hang', value: 'out_of_stock' },
      ],
      required: true,
    },
    {
      name: 'origin',
      type: 'text',
    },
    {
      name: 'size',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'bestSeller',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'preservationNotes',
      type: 'textarea',
    },
    {
      name: 'cookingNotes',
      type: 'textarea',
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
