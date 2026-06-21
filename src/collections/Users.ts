import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Người dùng',
    plural: 'Người dùng',
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tên',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Vai trò',
      defaultValue: 'admin',
      options: [{ label: 'Quản trị viên', value: 'admin' }],
      required: true,
    },
  ],
}