import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, parseBody, rateLimit, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

// ─── Zod schemas ─────────────────────────────────────────────────────────────
const VALID_CATEGORIES = [
  'Sea Water Fish', 'Backwater Fish', 'Freshwater Fish', 'Shelled Fish',
  'Imported Fish', 'Exotic Indian', 'Ready To Cook', 'Live Fish',
] as const

const VALID_UNITS = ['kg', 'piece', 'dozen', 'g'] as const

const CreateProductSchema = z.object({
  title:       z.string().min(1).max(200).trim(),
  description: z.string().max(1000).trim().optional().nullable(),
  category:    z.enum(VALID_CATEGORIES),
  price:       z.number().positive().max(100_000),
  unit:        z.enum(VALID_UNITS).default('kg'),
  imageUrl:    z.string().url().optional().nullable(),
  imageId:     z.string().max(300).optional().nullable(),
  inStock:     z.boolean().default(true),
  featured:    z.boolean().default(false),
  sortOrder:   z.number().int().min(0).default(0),
})

// ─── GET /api/products ────────────────────────────────────────────────────────
// Public: returns active products with optional search, category, stock filters
// Admin:  pass x-admin-secret to also see deleted products
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000 })
  if (limited) return limited

  try {
    const { searchParams } = new URL(req.url)
    const search    = searchParams.get('search')?.trim()
    const category  = searchParams.get('category')?.trim()
    const stock     = searchParams.get('stock')        // 'in' | 'out' | undefined
    const featured  = searchParams.get('featured')     // 'true' | undefined
    const page      = Math.max(1, parseInt(searchParams.get('page')  ?? '1'))
    const limit     = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '100')))
    const isAdmin   = validateAdminSecret(req.headers.get('x-admin-secret'))

    const where: Record<string, unknown> = {
      // Non-admin sees only active products
      ...(!isAdmin && { deletedAt: null }),
      ...(category && { category }),
      ...(stock === 'in'  && { inStock: true }),
      ...(stock === 'out' && { inStock: false }),
      ...(featured === 'true' && { featured: true }),
      ...(search && {
        OR: [
          { title:       { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category:    { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ])

    return ok({ products, total, page, limit, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return err('Failed to fetch products', 500)
  }
}

// ─── POST /api/products ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) {
    return err('Unauthorized', 401)
  }

  const { data, error } = await parseBody(req, CreateProductSchema)
  if (error) return error

  try {
    const product = await db.product.create({ data })

    await db.auditLog.create({
      data: {
        action: 'CREATE', entity: 'Product', entityId: product.id, productId: product.id,
        actorIp: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? null,
      },
    }).catch(() => {})

    return ok(product, 201)
  } catch (error) {
    console.error('POST /api/products error:', error)
    return err('Failed to create product', 500)
  }
}
