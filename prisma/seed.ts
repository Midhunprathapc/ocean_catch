import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// Map product titles to local public images
const IMAGE_MAP: Record<string, string> = {
  'OCTOPUS SMALL':                '/products/octopus.png',
  'SEA CRAB / KADAL NJAND - MEDIUM': '/products/crab.png',
  'SALMON FILLET':                '/products/salmon.png',
  'PRAWNS / CHEMMEEN - LARGE':    '/products/prawns.png',
  'KING FISH / NEIMEEN':          '/products/kingfish.png',
  'MUSSELS / KALLUMMAKAYA':       '/products/mussels.png',
  'SARDINES / MATHI':             '/products/sardines.png',
  'SQUID / KOONTHAL':             '/products/squid.png',
  'TUNA / CHOORA':                '/products/tuna.png',
  'PEARL SPOT / KARIMEEN':        '/products/pearlspot.png',
  'POMFRET / AVOLI':              '/products/pomfret.png',
  'ROHU / ROHU':                  '/products/rohu.png',
}

const products = [
  {
    title: 'OCTOPUS SMALL',
    category: 'Shelled Fish',
    price: 420,
    unit: 'kg',
    description: 'Fresh small octopus sourced from the Kerala coast. Tender and perfect for curries or grills.',
    inStock: true,
    featured: false,
    sortOrder: 1,
  },
  {
    title: 'SEA CRAB / KADAL NJAND - MEDIUM',
    category: 'Shelled Fish',
    price: 380,
    unit: 'kg',
    description: 'Freshly caught medium-sized sea crab. Ideal for crab roast or masala curry.',
    inStock: true,
    featured: false,
    sortOrder: 2,
  },
  {
    title: 'SALMON FILLET',
    category: 'Imported Fish',
    price: 890,
    unit: 'kg',
    description: 'Premium imported salmon fillet. Rich in omega-3, great for grilling or baking.',
    inStock: true,
    featured: true,
    sortOrder: 3,
  },
  {
    title: 'PRAWNS / CHEMMEEN - LARGE',
    category: 'Shelled Fish',
    price: 550,
    unit: 'kg',
    description: 'Large fresh prawns. Perfect for Kerala prawn curry or grilled preparations.',
    inStock: true,
    featured: true,
    sortOrder: 4,
  },
  {
    title: 'KING FISH / NEIMEEN',
    category: 'Sea Water Fish',
    price: 720,
    unit: 'kg',
    description: 'Premium king fish from the Arabian Sea. Ideal for frying, grilling, or curry.',
    inStock: true,
    featured: true,
    sortOrder: 5,
  },
  {
    title: 'MUSSELS / KALLUMMAKAYA',
    category: 'Shelled Fish',
    price: 280,
    unit: 'kg',
    description: 'Fresh mussels hand-picked daily. Perfect for steaming or Kerala-style masala.',
    inStock: true,
    featured: false,
    sortOrder: 6,
  },
  {
    title: 'SARDINES / MATHI',
    category: 'Sea Water Fish',
    price: 180,
    unit: 'kg',
    description: 'Freshly caught sardines — the classic Kerala fish for fry or curry.',
    inStock: true,
    featured: false,
    sortOrder: 7,
  },
  {
    title: 'SQUID / KOONTHAL',
    category: 'Shelled Fish',
    price: 460,
    unit: 'kg',
    description: 'Tender fresh squid. A coastal favourite for fry, roast, or masala.',
    inStock: true,
    featured: false,
    sortOrder: 8,
  },
  {
    title: 'TUNA / CHOORA',
    category: 'Sea Water Fish',
    price: 590,
    unit: 'kg',
    description: 'Fresh tuna from deep sea. High protein, great for fry or kothu preparations.',
    inStock: true,
    featured: false,
    sortOrder: 9,
  },
  {
    title: 'PEARL SPOT / KARIMEEN',
    category: 'Backwater Fish',
    price: 650,
    unit: 'kg',
    description: 'The jewel of Kerala backwaters. Best served pan-fried or in a green masala.',
    inStock: true,
    featured: true,
    sortOrder: 10,
  },
  {
    title: 'POMFRET / AVOLI',
    category: 'Sea Water Fish',
    price: 780,
    unit: 'kg',
    description: 'White pomfret with delicate sweet flesh. Perfect for frying or steaming.',
    inStock: true,
    featured: false,
    sortOrder: 11,
  },
  {
    title: 'ROHU / ROHU',
    category: 'Backwater Fish',
    price: 320,
    unit: 'kg',
    description: 'Fresh water rohu — a popular choice for fish curry and fried preparations.',
    inStock: true,
    featured: false,
    sortOrder: 12,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // ── Products ────────────────────────────────────────────────────────────────
  console.log('  → Seeding products...')
  let seeded = 0
  let skipped = 0

  for (const product of products) {
    // Generate a stable slug-based ID so re-seeding is idempotent
    const stableId = product.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    const imageUrl = IMAGE_MAP[product.title] ?? null

    const result = await db.product.upsert({
      where: { id: stableId },
      update: {
        // Update price and imageUrl on re-seed, leave user edits to title/desc alone
        price: product.price,
        imageUrl: imageUrl,
        sortOrder: product.sortOrder,
        featured: product.featured,
      },
      create: {
        id: stableId,
        ...product,
        imageUrl,
      },
    })
    if (result.createdAt === result.updatedAt) seeded++ ; else skipped++
  }

  console.log(`     ✓ ${seeded} created, ${skipped} already existed`)

  // ── Site Settings singleton ─────────────────────────────────────────────────
  console.log('  → Seeding site settings...')
  await db.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      phone: '+91 9656200209',
      email: 'midhunprathap.in@gmail.com',
      address: '42, Marine Drive, Kochi, Kerala 682031',
      facebookUrl: null,
      instagramUrl: null,
      whatsappUrl: 'https://wa.me/919656200209',
    },
  })
  console.log('     ✓ Site settings singleton ready')

  console.log('\n✅ Seeding complete.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
