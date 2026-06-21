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
        name: 'Long Phung Admin',
        password: adminPassword,
        role: 'admin',
      },
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      brandName: 'Long Phung Seafood',
      tagline: 'Hai san tuoi moi ngay cho gia dinh va nha hang',
      hotline: '0900 000 000',
      zaloUrl: 'https://zalo.me/0900000000',
      address: 'Cap nhat dia chi cua Long Phung',
      businessHours: '06:00 - 20:00 hang ngay',
      seo: {
        title: 'Long Phung Seafood',
        description: 'Hai san tuoi song, sashimi, combo gia dinh va bang gia moi ngay.',
      },
    },
  })

  const categoryData = [
    {
      name: 'Hai san tuoi',
      description: 'Tom, cua, ghe, muc va ca duoc cap nhat moi ngay.',
      featured: true,
      sortOrder: 10,
    },
    {
      name: 'Sashimi',
      description: 'Ca hoi, ca trich ep trung, bach tuoc va set an lien.',
      featured: true,
      sortOrder: 20,
    },
    {
      name: 'Combo gia dinh',
      description: 'Combo nau lau, tiec nho va bua an nhanh trong ngay.',
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
      name: 'Tom su song',
      unit: 'kg',
      retailPrice: 360000,
      wholesalePrice: 330000,
      stockStatus: 'in_stock',
      origin: 'Vung nuoi mien Tay',
      size: '20-25 con/kg',
      featured: true,
      bestSeller: true,
      shortDescription: 'Tom su con khoe, thit chac, hop hap bia, nuong muoi ot hoac nau lau.',
      preservationNotes: 'Giu lanh 0-4 do C va che bien som sau khi nhan.',
      cookingNotes: 'Hop hap bia, nuong muoi ot hoac nau lau deu phu hop.',
    },
    {
      categorySlug: 'sashimi',
      name: 'Ca hoi sashimi',
      unit: 'kg',
      retailPrice: 620000,
      wholesalePrice: 590000,
      stockStatus: 'in_stock',
      origin: 'Na Uy',
      size: 'Cat phan theo yeu cau',
      featured: true,
      bestSeller: true,
      shortDescription: 'Thit ca beo, mau dep, giao lanh trong ngay cho gia dinh va nha hang.',
      preservationNotes: 'Bao quan lanh sau 0-4 do C, dung ngon nhat trong ngay.',
      cookingNotes: 'Dung sashimi, salad, ap chao nhe hoac sushi roll.',
    },
    {
      categorySlug: 'combo-gia-dinh',
      name: 'Combo lau hai san',
      unit: 'set',
      retailPrice: 499000,
      stockStatus: 'in_stock',
      origin: 'Long Phung',
      size: '3-4 nguoi',
      featured: true,
      bestSeller: false,
      shortDescription: 'Set tien loi gom tom, muc, ca vien va rau gia vi co ban cho bua lau nhanh.',
      preservationNotes: 'Giu lanh va dung trong ngay de co huong vi tot nhat.',
      cookingNotes: 'Dung voi nuoc lau thai, lau nam hoac lau chua cay.',
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
      note: index === 0 ? 'Gia tot cho don dat truoc 10h' : 'Cap nhat moi ngay',
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

  // Use upsert for banners too to make seed idempotent (prevent duplicates on re-run)
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
    linkLabel: 'Xem bang gia',
    linkUrl: '/bang-gia',
    placement: PLACEMENTS.HOME,
    sortOrder: 10,
    subtitle:
      'Long Phung cap nhat san pham va bang gia moi ngay, uu tien dat nhanh qua Zalo hoac hotline.',
    title: 'Hai san tuoi cho bua an gia dinh va bep nha hang',
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
      title: 'Cach chon hai san tuoi cho bua an gia dinh',
      excerpt: 'Nhung dau hieu don gian de nhan biet tom, cua, muc va ca con tuoi khi dat hang.',
      featured: true,
    },
    {
      title: 'Bao quan sashimi tai nha nhu the nao',
      excerpt: 'Cach giu lanh, thoi gian dung ngon va nhung luu y khi nhan hang sashimi.',
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

  console.log(`Seed complete. Admin: ${adminEmail} / ${adminPassword}`)
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
