import type { CollectionConfig } from 'payload'

import { admins, publishedOrAdmin } from '@/access/admins'
import { slugify } from '@/lib/slugify'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Bài viết',
    plural: 'Bài viết',
  },
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
      label: 'Tiêu đề',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Đường dẫn (slug)',
      required: true,
      unique: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'Ảnh bìa',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Tóm tắt',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      label: 'Sản phẩm liên quan',
      hasMany: true,
      relationTo: 'products',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Nổi bật',
      defaultValue: false,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Tiêu đề SEO' },
        { name: 'description', type: 'textarea', label: 'Mô tả SEO' },
      ],
    },
  ],
}