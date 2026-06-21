import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ThumbnailCell(props: any) {
  const { cellData } = props

  if (!cellData) return null

  let src: string | null | undefined = ''

  if (typeof cellData === 'object' && cellData.url) {
    src = cellData.sizes?.thumbnail?.url || cellData.url
  } else if (typeof cellData === 'number' || typeof cellData === 'string') {
    try {
      const payload = await getPayload({ config })
      const media = await payload.findByID({ collection: 'media', id: cellData })
      if (media) {
        src = media.sizes?.thumbnail?.url || media.url;
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (!src) return null

  return (
    <div style={{ width: '40px', height: '40px', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
      <img src={src} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  )
}
