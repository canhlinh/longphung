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
      icon: '🦐',
      color: '#0ea5b8',
      sourceGroupId: 1,
    },
    {
      name: 'Sashimi & Cá',
      description: 'Cá hồi, cá trích ép trứng, bạch tuộc và set ăn liền.',
      featured: true,
      sortOrder: 20,
      icon: '🍣',
      color: '#1565c0',
      sourceGroupId: 2,
    },
    {
      name: 'Lẩu & Nướng',
      description: 'Combo và nguyên liệu cho nồi lẩu, nướng hải sản.',
      featured: true,
      sortOrder: 30,
      icon: '🍲',
      color: '#f97316',
      sourceGroupId: 3,
    },
    {
      name: 'Đặc sản & Khác',
      description: 'Các loại hải sản đặc biệt và hàng nhập.',
      featured: true,
      sortOrder: 40,
      icon: '🦀',
      color: '#0f766e',
      sourceGroupId: 4,
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
      sourceImageUrl: 'https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?w=600',
      isNewListing: false,
      priceDirection: 'down',
    },
    {
      categorySlug: 'hai-san-tuoi',
      name: 'Cua biển sống',
      unit: 'kg',
      retailPrice: 420000,
      wholesalePrice: 385000,
      stockStatus: 'in_stock',
      origin: 'Biển Đông',
      size: '3-4 con/kg',
      featured: true,
      bestSeller: true,
      shortDescription: 'Cua biển tươi, gạch đầy, thịt chắc ngọt.',
      preservationNotes: 'Bảo quản mát, chế biến trong ngày.',
      cookingNotes: 'Hấp, rang muối, nấu lẩu.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600',
      isNewListing: false,
      priceDirection: 'none',
    },
    {
      categorySlug: 'hai-san-tuoi',
      name: 'Mực ống tươi',
      unit: 'kg',
      retailPrice: 185000,
      wholesalePrice: 165000,
      stockStatus: 'in_stock',
      origin: 'Nha Trang',
      size: '10-15 con/kg',
      featured: false,
      bestSeller: true,
      shortDescription: 'Mực ống tươi, da bóng, giòn ngọt.',
      preservationNotes: 'Giữ lạnh ngay sau khi nhận.',
      cookingNotes: 'Chiên giòn, xào, nướng.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600',
      isNewListing: true,
      priceDirection: 'up',
    },
    {
      categorySlug: 'sashimi',
      name: 'Cá hồi Nauy sashimi',
      unit: 'kg',
      retailPrice: 620000,
      wholesalePrice: 580000,
      stockStatus: 'in_stock',
      origin: 'Na Uy',
      size: 'Cắt phi lê sẵn',
      featured: true,
      bestSeller: true,
      shortDescription: 'Cá hồi Nauy cao cấp, thịt hồng tươi, ít mỡ.',
      preservationNotes: 'Bảo quản 0-4°C, dùng trong 24h.',
      cookingNotes: 'Sashimi, salad, sashimi bowl.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600',
      isNewListing: false,
      priceDirection: 'none',
    },
    {
      categorySlug: 'sashimi',
      name: 'Cá trích ép trứng',
      unit: 'hop',
      retailPrice: 145000,
      wholesalePrice: 128000,
      stockStatus: 'in_stock',
      origin: 'Nhật Bản',
      size: 'Hộp 200g',
      featured: true,
      bestSeller: false,
      shortDescription: 'Cá trích ép trứng Na Uy, béo ngậy.',
      preservationNotes: 'Giữ đông hoặc tủ lạnh.',
      cookingNotes: 'Ăn trực tiếp hoặc cuộn sushi.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600',
      isNewListing: true,
      priceDirection: 'down',
    },
    {
      categorySlug: 'lẩu-nướng',
      name: 'Combo lẩu hải sản gia đình',
      unit: 'set',
      retailPrice: 499000,
      wholesalePrice: 455000,
      stockStatus: 'in_stock',
      origin: 'Long Phụng',
      size: '3-4 người',
      featured: true,
      bestSeller: true,
      shortDescription: 'Set đầy đủ: tôm, mực, cua, cá viên, rau và gia vị.',
      preservationNotes: 'Giữ lạnh, dùng trong ngày.',
      cookingNotes: 'Lẩu thái, lẩu chua cay, nướng.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1606851091851-e8c8c0fca5ba?w=600',
      isNewListing: false,
      priceDirection: 'none',
    },
    {
      categorySlug: 'lẩu-nướng',
      name: 'Tôm hùm baby',
      unit: 'con',
      retailPrice: 285000,
      wholesalePrice: 255000,
      stockStatus: 'preorder',
      origin: 'Nha Trang',
      size: '200-300g/con',
      featured: false,
      bestSeller: false,
      shortDescription: 'Tôm hùm baby tươi sống, ngọt thịt.',
      preservationNotes: 'Giữ sống hoặc cấp đông.',
      cookingNotes: 'Hấp bia, nướng phô mai, lẩu.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?w=600',
      isNewListing: false,
      priceDirection: 'up',
    },
    {
      categorySlug: 'lẩu-nướng',
      name: 'Ghẹ xanh sống',
      unit: 'kg',
      retailPrice: 310000,
      wholesalePrice: 275000,
      stockStatus: 'in_stock',
      origin: 'Biển Đông',
      size: '4-5 con/kg',
      featured: true,
      bestSeller: false,
      shortDescription: 'Ghẹ xanh thịt ngọt, gạch đỏ.',
      preservationNotes: 'Bảo quản mát.',
      cookingNotes: 'Hấp, rang muối ớt, nấu lẩu.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600',
      isNewListing: false,
      priceDirection: 'none',
    },
    {
      categorySlug: 'đặc-sản-khác',
      name: 'Bạch tuộc baby',
      unit: 'kg',
      retailPrice: 195000,
      wholesalePrice: 175000,
      stockStatus: 'in_stock',
      origin: 'Phú Quốc',
      size: '20-30 con/kg',
      featured: false,
      bestSeller: true,
      shortDescription: 'Bạch tuộc baby giòn, ngọt.',
      preservationNotes: 'Giữ lạnh.',
      cookingNotes: 'Xào, nướng, lẩu.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600',
      isNewListing: true,
      priceDirection: 'down',
    },
    {
      categorySlug: 'đặc-sản-khác',
      name: 'Hàu sữa tươi',
      unit: 'thung',
      retailPrice: 380000,
      wholesalePrice: 345000,
      stockStatus: 'in_stock',
      origin: 'Nha Trang',
      size: 'Thùng 30 con',
      featured: true,
      bestSeller: false,
      shortDescription: 'Hàu sữa béo, tươi sống.',
      preservationNotes: 'Giữ sống.',
      cookingNotes: 'Nướng phô mai, hấp sả.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
      isNewListing: false,
      priceDirection: 'none',
    },
    {
      categorySlug: 'hai-san-tuoi',
      name: 'Cá mú sống',
      unit: 'kg',
      retailPrice: 265000,
      wholesalePrice: 235000,
      stockStatus: 'in_stock',
      origin: 'Bình Định',
      size: '1.5-2kg/con',
      featured: false,
      bestSeller: false,
      shortDescription: 'Cá mú tươi, thịt chắc dai.',
      preservationNotes: 'Giữ sống hoặc lạnh.',
      cookingNotes: 'Hấp, chiên, lẩu.',
      sourceImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
      isNewListing: false,
      priceDirection: 'up',
    },
  ]

  const productDocs = []

  for (const product of products) {
    const slug = slugify(product.name)
    const categorySlug = slugify(product.categorySlug)
    let category = categories.get(categorySlug)
    if (!category && categorySlug === 'sashimi') {
      category = categories.get('sashimi-ca')
    }
    if (!category) {
      throw new Error(`Category not found for slug: ${product.categorySlug} (slugified: ${categorySlug})`)
    }
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

    // Add some price tiers for demo (to show multi-row pricing in wholesale board)
    let priceTiers = undefined
    if (index % 3 === 0) {
      priceTiers = [
        { name: '1-5 kg', price: Math.round(product.wholesalePrice * 0.95), pco: Math.round(product.wholesalePrice * 0.95) },
        { name: '5-10 kg', price: product.wholesalePrice, pco: product.wholesalePrice },
        { name: 'Trên 10 kg', price: Math.round(product.wholesalePrice * 0.92), pco: Math.round(product.wholesalePrice * 0.92) },
      ]
    }

    const data = {
      date: new Date().toISOString(),
      displayName: product.name,
      isActive: true,
      note: product.isNewListing ? 'Hàng mới về, giá tốt' : 'Cập nhật mỗi ngày',
      price: product.retailPrice,
      product: product.id,
      sortOrder: index * 10,
      unit: product.unit,
      displayUnit: product.unit === 'con' ? 'con' : product.unit === 'set' ? 'set' : product.unit === 'thung' ? 'thùng' : 'kg',
      wholesalePrice: product.wholesalePrice,
      priceTiers,
      externalKey: `seed-${index}`,
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

  // Rich demo wholesale customers (to fully exercise the redesigned /bg UI)
  await upsertBySlug(payload, 'wholesale-customers', 'tran-long-7bc3ps', {
    name: 'Trần Long',
    slug: 'tran-long-7bc3ps',
    contactPerson: 'Anh Long',
    phone: '0901 234 567',
    greeting: 'Chào anh Long, hàng tươi mỗi ngày dành riêng cho quán.',
    tierName: 'Khách thường',
    saleName: 'Chị Hương',
    salePhone: '0909 888 777',
    bossName: 'Anh Tuấn',
    bossPhone: '0912 333 444',
    promoText: 'Đặt trước 9h sáng được giao miễn phí nội thành.',
    isActive: true,
  })

  await upsertBySlug(payload, 'wholesale-customers', 'quanan-hai-san-vip', {
    name: 'Quán Hải Sản VIP',
    slug: 'quanan-hai-san-vip',
    contactPerson: 'Anh Minh',
    phone: '0933 222 111',
    greeting: 'Cảm ơn anh Minh đã tin tưởng Long Phụng.',
    tierName: 'VIP Quán ăn',
    saleName: 'Anh Khoa',
    salePhone: '0908 555 666',
    promoText: 'Khách VIP được ưu tiên giá sỉ tốt nhất + hỗ trợ giao sớm.',
    isActive: true,
  })

  await upsertBySlug(payload, 'wholesale-customers', 'bui-thi-lan', {
    name: 'Bùi Thị Lan',
    slug: 'bui-thi-lan',
    contactPerson: 'Chị Lan',
    phone: '0977 111 222',
    greeting: 'Chúc chị Lan một ngày buôn may bán đắt!',
    tierName: 'Khách lẻ sỉ',
    saleName: 'Chị Hương',
    salePhone: '0909 888 777',
    isActive: true,
  })

  console.log(`Seed complete. Admin: ${adminEmail} / ${adminPassword}`)
  console.log('Wholesale demo links:')
  console.log('  /bg/tran-long-7bc3ps')
  console.log('  /bg/quanan-hai-san-vip (VIP tier + sale info)')
  console.log('  /bg/bui-thi-lan')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})