import type { CollectionConfig } from 'payload'

import { admins, publishedOrAdmin } from '@/access/admins'
import { PLACEMENT_LABELS, PLACEMENTS } from '@/lib/constants'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: 'Banner',
    plural: 'Banner',
  },
  admin: {
    defaultColumns: ['title', 'image', 'placement', 'isActive', 'sortOrder', '_status'],
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
      label: 'Tiêu đề',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Phụ đề',
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Hình ảnh',
      relationTo: 'media',
      admin: {
        components: {
          Cell: '@/collections/ThumbnailCell',
        },
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      label: 'Nhãn nút',
    },
    {
      name: 'linkUrl',
      type: 'text',
      label: 'Liên kết',
    },
    {
      name: 'placement',
      type: 'select',
      label: 'Vị trí hiển thị',
      defaultValue: PLACEMENTS.HOME,
      options: [{ label: PLACEMENT_LABELS[PLACEMENTS.HOME], value: PLACEMENTS.HOME }],
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Đang hiển thị',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Thứ tự hiển thị',
      defaultValue: 0,
    },
  ],
}