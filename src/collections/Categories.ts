import type { CollectionConfig } from 'payload'

import { admins, anyone } from '@/access/admins'
import { slugify } from '@/lib/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Danh mục',
    plural: 'Danh mục',
  },
  admin: {
    group: 'Cửa hàng',
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
      label: 'Tên danh mục',
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
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon nhóm',
      admin: {
        description: 'Emoji hiển thị trên bảng giá sỉ.',
      },
    },
    {
      name: 'color',
      type: 'text',
      label: 'Màu nhóm',
      admin: {
        description: 'Mã màu hex cho placeholder ảnh.',
      },
    },
    {
      name: 'sourceGroupId',
      type: 'number',
      label: 'ID nhóm nguồn',
      admin: {
        description: 'ID nhóm từ hệ thống import.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Hình ảnh',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Nổi bật',
      defaultValue: false,
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Thứ tự hiển thị',
      defaultValue: 0,
    },
  ],
}