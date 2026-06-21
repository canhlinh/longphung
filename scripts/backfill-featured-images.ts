import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@/payload.config'

async function run() {
  const payload = await getPayload({ config })
  
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  let count = 0
  for (const product of products.docs) {
    if (product.images && product.images.length > 0) {
      let imageId = product.images[0].image
      if (typeof imageId === 'object' && imageId !== null) {
        imageId = (imageId as any).id
      }
      
      if (product.featuredImage !== imageId) {
        await payload.update({
          collection: 'products',
          id: product.id,
          data: {
            featuredImage: imageId,
          },
        })
        count++
        console.log(`Updated product: ${product.name}`)
      }
    }
  }

  console.log(`Finished. Updated ${count} products.`)
  process.exit(0)
}

run().catch(console.error)
