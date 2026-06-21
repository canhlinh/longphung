import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { createWholesaleSlug, getWholesaleLink } from '@/lib/wholesale-token'

export const WholesaleCustomers: CollectionConfig = {
  slug: 'wholesale-customers',
  labels: {
    singular: 'Khách sỉ',
    plural: 'Khách sỉ',
  },
  admin: {
    defaultColumns: ['name', 'slug', 'contactPerson', 'isActive'],
    useAsTitle: 'name',
    description: 'Mỗi khách sỉ có một link riêng dạng /bg/ten-khach-xxxxxx để xem giá sỉ và đặt hàng.',
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
  hooks: {
    beforeValidate: [
      ({ data, operation: _operation }) => {
        if (data?.name && !data.slug) {
          data.slug = createWholesaleSlug(data.name)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tên khách / nhà hàng',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Link đặt hàng',
      required: true,
      unique: true,
      admin: {
        description: 'Tự tạo khi lưu. Ví dụ: tran-long-7bc3ps',
      },
    },
    {
      name: 'orderLink',
      type: 'text',
      label: 'Đường dẫn đầy đủ',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Gửi link này cho khách sỉ.',
      },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            if (!siblingData?.slug) {
              return ''
            }
            return getWholesaleLink(siblingData.slug)
          },
        ],
      },
    },
    {
      name: 'contactPerson',
      type: 'text',
      label: 'Người liên hệ',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại khách',
    },
    {
      name: 'greeting',
      type: 'textarea',
      label: 'Lời chào riêng',
      admin: {
        description: 'Hiển thị trên trang bảng giá sỉ của khách.',
      },
    },
    {
      name: 'tierName',
      type: 'text',
      label: 'Hạng khách',
    },
    {
      name: 'storeDisplayName',
      type: 'text',
      label: 'Tên hiển thị trên bảng giá',
    },
    {
      name: 'saleName',
      type: 'text',
      label: 'Sales phụ trách',
    },
    {
      name: 'salePhone',
      type: 'text',
      label: 'SĐT sales',
    },
    {
      name: 'bossName',
      type: 'text',
      label: 'Sếp / số dự phòng',
    },
    {
      name: 'bossPhone',
      type: 'text',
      label: 'SĐT sếp',
    },
    {
      name: 'promoText',
      type: 'text',
      label: 'Banner khuyến mãi',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Đang hoạt động',
      defaultValue: true,
    },
  ],
}