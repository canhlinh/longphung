import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { UNIT_OPTIONS } from '@/lib/constants'

export const DailyPrices: CollectionConfig = {
  slug: 'daily-prices',
  labels: {
    singular: 'Bảng giá',
    plural: 'Bảng giá',
  },
  admin: {
    defaultColumns: ['date', 'product', 'displayName', 'price', 'isActive'],
    useAsTitle: 'displayName',
  },
  access: {
    create: admins,
    delete: admins,
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
      label: 'Ngày',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      label: 'Sản phẩm',
      relationTo: 'products',
    },
    {
      name: 'displayName',
      type: 'text',
      label: 'Tên hiển thị',
      required: true,
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
      name: 'price',
      type: 'number',
      label: 'Giá lẻ',
      min: 0,
      required: true,
    },
    {
      name: 'wholesalePrice',
      type: 'number',
      label: 'Giá sỉ',
      min: 0,
    },
    {
      name: 'note',
      type: 'text',
      label: 'Ghi chú',
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