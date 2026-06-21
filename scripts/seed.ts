import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import { slugify } from '@/lib/slugify'
import { PLACEMENTS } from '@/lib/constants'

const adminEmail = process.env.ADMIN_EMAIL || 'admin@longphung.local'
const adminPassword = process.env.ADMIN_PASSWORD || 'LongPhung123!'

async function upsertBySlug(payload: any, collection: string, slug: string, data: Record<string, any>) {
  const existing = await payload.find({
    collection,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (existing.docs[0]) {
    return payload.update({
      id: existing.docs[0].id,
      collection,
      data,
    })
  }

  return payload.create({
    collection,
    data,
  })
}

async function seed() {
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    limit: 1,
    where: {
      email: {
        equals: adminEmail,
      },
    },
  })

  if (!users.docs.length) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        name: 'Long Phụng Admin',
        password: adminPassword,
        role: 'admin',
      },
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      brandName: 'Hải Sản Long Phụng',
      tagline: 'Hải sản tươi mỗi ngày cho gia đình và nhà hàng',
      hotline: '0900 000 000',
      zaloUrl: 'https://zalo.me/0900000000',
      address: 'Cập nhật địa chỉ của Long Phụng',
      businessHours: '06:00 - 20:00 hằng ngày',
      seo: {
        title: 'Long Phụng Seafood',
        description: 'Hải sản tươi sống, sashimi, combo gia đình và bảng giá mỗi ngày.',
      },
    },
  })

  const categoryData = [
    {
      name: 'Hải sản tươi',
      description: 'Tôm, cua, ghẹ, mực và cá được cập nhật mỗi ngày.',
      featured: true,
      sortOrder: 10,
    },
    {
      name: 'Sashimi',
      description: 'Cá hồi, cá trích ép trứng, bạch tuộc và set ăn liền.',
      featured: true,
      sortOrder: 20,
    },
    {
      name: 'Combo gia đình',
      description: 'Combo nấu lẩu, tiệc nhỏ và bữa ăn nhanh trong ngày.',
      featured: true,
      sortOrder: 30,
    },
  ]

  const categories = new Map<string, any>()

  for (const category of categoryData) {
    const slug = slugify(category.name)
    const doc = await upsertBySlug(payload, 'categories', slug, {
      ...category,
      slug,
    })
    categories.set(slug, doc)
  }

  const products = [
    {
      categorySlug: 'hai-san-tuoi',
      name: 'Tôm sú sống',
      unit: 'kg',
      retailPrice: 360000,
      wholesalePrice: 330000,
      stockStatus: 'in_stock',
      origin: 'Vùng nuôi miền Tây',
      size: '20-25 con/kg',
      featured: true,
      bestSeller: true,
      shortDescription: 'Tôm sú còn khỏe, thịt chắc, hợp hấp bia, nướng muối ớt hoặc nấu lẩu.',
      preservationNotes: 'Giữ lạnh 0-4 độ C và chế biến sớm sau khi nhận.',
      cookingNotes: 'Hợp hấp bia, nướng muối ớt hoặc nấu lẩu đều phù hợp.',
    },
    {
      categorySlug: 'sashimi',
      name: 'Cá hồi sashimi',
      unit: 'kg',
      retailPrice: 620000,
      wholesalePrice: 590000,
      stockStatus: 'in_stock',
      origin: 'Na Uy',
      size: 'Cắt phần theo yêu cầu',
      featured: true,
      bestSeller: true,
      shortDescription: 'Thịt cá béo, màu đẹp, giao lạnh trong ngày cho gia đình và nhà hàng.',
      preservationNotes: 'Bảo quản lạnh sau 0-4 độ C, dùng ngon nhất trong ngày.',
      cookingNotes: 'Dùng sashimi, salad, áp chảo nhẹ hoặc sushi roll.',
    },
    {
      categorySlug: 'combo-gia-dinh',
      name: 'Combo lẩu hải sản',
      unit: 'set',
      retailPrice: 499000,
      stockStatus: 'in_stock',
      origin: 'Long Phụng',
      size: '3-4 người',
      featured: true,
      bestSeller: false,
      shortDescription: 'Set tiện lợi gồm tôm, mực, cá viên và rau gia vị cơ bản cho bữa lẩu nhanh.',
      preservationNotes: 'Giữ lạnh và dùng trong ngày để có hương vị tốt nhất.',
      cookingNotes: 'Dùng với nước lẩu thái, lẩu nấm hoặc lẩu chua cay.',
    },
  ]

  const productDocs = []

  for (const product of products) {
    const slug = slugify(product.name)
    const category = categories.get(product.categorySlug)
    const doc = await upsertBySlug(payload, 'products', slug, {
      ...product,
      _status: 'published',
      category: category.id,
      slug,
    })
    productDocs.push(doc)
  }

  for (const [index, product] of productDocs.entries()) {
    const existing = await payload.find({
      collection: 'daily-prices',
      limit: 1,
      where: {
        displayName: {
          equals: product.name,
        },
      },
    })

    const data = {
      date: new Date().toISOString(),
      displayName: product.name,
      isActive: true,
      note: index === 0 ? 'Giá tốt cho đơn đặt trước 10h' : 'Cập nhật mỗi ngày',
      price: product.retailPrice,
      product: product.id,
      sortOrder: index * 10,
      unit: product.unit,
      wholesalePrice: product.wholesalePrice,
    }

    if (existing.docs[0]) {
      await payload.update({ collection: 'daily-prices', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'daily-prices', data })
    }
  }

  const bannerExisting = await payload.find({
    collection: 'banners',
    limit: 1,
    where: {
      placement: {
        equals: 'home',
      },
    },
  })
  const bannerData = {
    _status: 'published' as const,
    isActive: true,
    linkLabel: 'Xem bảng giá',
    linkUrl: '/bang-gia',
    placement: PLACEMENTS.HOME,
    sortOrder: 10,
    subtitle:
      'Long Phụng cập nhật sản phẩm và bảng giá mỗi ngày, ưu tiên đặt nhanh qua Zalo hoặc hotline.',
    title: 'Hải sản tươi cho bữa ăn gia đình và bếp nhà hàng',
  }
  if (bannerExisting.docs[0]) {
    await payload.update({
      collection: 'banners',
      id: bannerExisting.docs[0].id,
      data: bannerData,
    })
  } else {
    await payload.create({ collection: 'banners', data: bannerData })
  }

  const posts = [
    {
      title: 'Cách chọn hải sản tươi cho bữa ăn gia đình',
      excerpt: 'Những dấu hiệu đơn giản để nhận biết tôm, cua, mực và cá còn tươi khi đặt hàng.',
      featured: true,
    },
    {
      title: 'Bảo quản sashimi tại nhà như thế nào',
      excerpt: 'Cách giữ lạnh, thời gian dùng ngon và những lưu ý khi nhận hàng sashimi.',
      featured: true,
    },
  ]

  for (const post of posts) {
    const slug = slugify(post.title)
    await upsertBySlug(payload, 'posts', slug, {
      ...post,
      _status: 'published',
      slug,
      relatedProducts: productDocs.slice(0, 2).map((product) => product.id),
    })
  }

  await upsertBySlug(payload, 'wholesale-customers', 'tran-long-7bc3ps', {
    name: 'Trần Long',
    slug: 'tran-long-7bc3ps',
    contactPerson: 'Anh Long',
    phone: '0901 234 567',
    greeting: 'Chào anh Long, đây là bảng giá sỉ dành riêng cho quán của anh.',
    storeDisplayName: null,
    saleName: null,
    salePhone: null,
    bossName: null,
    bossPhone: null,
    promoText: null,
    isActive: true,
  })

  console.log(`Seed complete. Admin: ${adminEmail} / ${adminPassword}`)
  console.log('Wholesale demo link: /bg/tran-long-7bc3ps')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})