import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const products = [
  { title: 'OCTOPUS SMALL', category: 'Shelled Fish', price: 420, unit: 'kg', description: 'Fresh small octopus sourced from the Kerala coast. Tender and perfect for curries or grills.', inStock: true },
  { title: 'SEA CRAB / KADAL NJAND - MEDIUM', category: 'Shelled Fish', price: 380, unit: 'kg', description: 'Freshly caught medium-sized sea crab. Ideal for crab roast or masala curry.', inStock: true },
  { title: 'SALMON FILLET', category: 'Imported Fish', price: 890, unit: 'kg', description: 'Premium imported salmon fillet. Rich in omega-3, great for grilling or baking.', inStock: true },
  { title: 'PRAWNS / CHEMMEEN - LARGE', category: 'Shelled Fish', price: 550, unit: 'kg', description: 'Large fresh prawns. Perfect for Kerala prawn curry or grilled preparations.', inStock: true },
  { title: 'KING FISH / NEIMEEN', category: 'Sea Water Fish', price: 720, unit: 'kg', description: 'Premium king fish from the Arabian Sea. Ideal for frying, grilling, or curry.', inStock: true },
  { title: 'MUSSELS / KALLUMMAKAYA', category: 'Shelled Fish', price: 280, unit: 'kg', description: 'Fresh mussels hand-picked daily. Perfect for steaming or Kerala-style masala.', inStock: true },
  { title: 'SARDINES / MATHI', category: 'Sea Water Fish', price: 180, unit: 'kg', description: 'Freshly caught sardines — the classic Kerala fish for fry or curry.', inStock: true },
  { title: 'SQUID / KOONTHAL', category: 'Shelled Fish', price: 460, unit: 'kg', description: 'Tender fresh squid. A coastal favourite for fry, roast, or masala.', inStock: true },
  { title: 'TUNA / CHOORA', category: 'Sea Water Fish', price: 590, unit: 'kg', description: 'Fresh tuna from deep sea. High protein, great for fry or kothu preparations.', inStock: true },
  { title: 'PEARL SPOT / KARIMEEN', category: 'Backwater Fish', price: 650, unit: 'kg', description: 'The jewel of Kerala backwaters. Best served pan-fried or in a green masala.', inStock: true },
  { title: 'POMFRET / AVOLI', category: 'Sea Water Fish', price: 780, unit: 'kg', description: 'White pomfret with delicate sweet flesh. Perfect for frying or steaming.', inStock: true },
  { title: 'ROHU / ROHU', category: 'Backwater Fish', price: 320, unit: 'kg', description: 'Fresh water rohu — a popular choice for fish curry and fried preparations.', inStock: true },
]

async function main() {
  console.log('Seeding products...')
  for (const product of products) {
    await db.product.upsert({
      where: { id: product.title.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      update: {},
      create: product,
    })
  }
  console.log(`Seeded ${products.length} products.`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
