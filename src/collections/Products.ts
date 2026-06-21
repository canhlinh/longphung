import type { CollectionConfig } from 'payload'

import { admins, publishedOrAdmin } from '@/access/admins'
import { STOCK_OPTIONS, UNIT_OPTIONS } from '@/lib/constants'
import { slugify } from '@/lib/slugify'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Sản phẩm',
    plural: 'Sản phẩm',
  },
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
      label: 'Tên sản phẩm',
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
      name: 'category',
      type: 'relationship',
      label: 'Danh mục',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Hình ảnh',
      maxRows: 8,
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Ảnh',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'unit',
      type: 'select',
      label: 'Đơn vị',
      defaultValue: 'kg',
      options: UNIT_OPTIONS,
      required: true,
    },
    {
      name: 'retailPrice',
      type: 'number',
      label: 'Giá lẻ',
      min: 0,
    },
    {
      name: 'wholesalePrice',
      type: 'number',
      label: 'Giá sỉ',
      min: 0,
    },
    {
      name: 'priceLabel',
      type: 'text',
      label: 'Nhãn giá',
      admin: {
        description: 'Dùng cho giá linh hoạt như "Liên hệ" hoặc "Theo ngày".',
      },
    },
    {
      name: 'stockStatus',
      type: 'select',
      label: 'Tình trạng hàng',
      defaultValue: 'in_stock',
      options: STOCK_OPTIONS,
      required: true,
    },
    {
      name: 'origin',
      type: 'text',
      label: 'Nguồn hàng',
    },
    {
      name: 'size',
      type: 'text',
      label: 'Quy cách',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Nổi bật',
      defaultValue: false,
    },
    {
      name: 'bestSeller',
      type: 'checkbox',
      label: 'Bán chạy',
      defaultValue: false,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Mô tả ngắn',
      required: true,
    },
    {
      name: 'sourceImageUrl',
      type: 'text',
      label: 'Ảnh nguồn (URL)',
      admin: {
        description: 'URL ảnh import từ bảng giá bên ngoài.',
      },
    },
    {
      name: 'externalKey',
      type: 'text',
      label: 'Khóa nguồn',
      admin: {
        description: 'ID sản phẩm từ hệ thống import.',
      },
    },
    {
      name: 'isNewListing',
      type: 'checkbox',
      label: 'Mới về',
      defaultValue: false,
    },
    {
      name: 'priceDirection',
      type: 'select',
      label: 'Biến động giá',
      options: [
        { label: 'Không', value: 'none' },
        { label: 'Tăng', value: 'up' },
        { label: 'Giảm', value: 'down' },
      ],
      defaultValue: 'none',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Mô tả chi tiết',
    },
    {
      name: 'preservationNotes',
      type: 'textarea',
      label: 'Hướng dẫn bảo quản',
    },
    {
      name: 'cookingNotes',
      type: 'textarea',
      label: 'Gợi ý chế biến',
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