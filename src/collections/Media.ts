import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Hình ảnh',
    plural: 'Hình ảnh',
  },
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Mô tả ảnh',
      required: true,
    },
  ],
  upload: {
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        height: 300,
        position: 'centre',
      },
      {
        name: 'preview',
        height: 900,
        position: 'centre',
      },
    ],
  },
}