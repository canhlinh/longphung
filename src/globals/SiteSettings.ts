import type { GlobalConfig } from 'payload'

import { admins, anyone } from '@/access/admins'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cài đặt website',
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      label: 'Tên thương hiệu',
      defaultValue: 'Hải Sản Long Phụng',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Khẩu hiệu',
      defaultValue: 'Hải sản tươi mỗi ngày cho gia đình và nhà hàng',
    },
    {
      name: 'hotline',
      type: 'text',
      label: 'Hotline',
      defaultValue: '0900 000 000',
      required: true,
    },
    {
      name: 'zaloUrl',
      type: 'text',
      label: 'Liên kết Zalo',
      defaultValue: 'https://zalo.me/0900000000',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Địa chỉ',
      defaultValue: 'Cập nhật địa chỉ của Long Phụng',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Facebook',
    },
    {
      name: 'businessHours',
      type: 'text',
      label: 'Giờ mở cửa',
      defaultValue: '06:00 - 20:00 hằng ngày',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề SEO',
          defaultValue: 'Hải Sản Long Phụng',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả SEO',
          defaultValue: 'Hải sản tươi sống, sashimi, combo gia đình và bảng giá mỗi ngày.',
        },
      ],
    },
  ],
}