import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, parseBody, rateLimit, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

const VALID_CATEGORIES = [
  'Sea Water Fish', 'Backwater Fish', 'Freshwater Fish', 'Shelled Fish',
  'Imported Fish', 'Exotic Indian', 'Ready To Cook', 'Live Fish',
] as const

const VALID_UNITS = ['kg', 'piece', 'dozen', 'g'] as const

const UpdateProductSchema = z.object({
  title:       z.string().min(1).max(200).trim().optional(),
  description: z.string().max(1000).trim().nullable().optional(),
  category:    z.enum(VALID_CATEGORIES).optional(),
  price:       z.number().positive().max(100_000).optional(),
  unit:        z.enum(VALID_UNITS).optional(),
  imageUrl:    z.string().url().nullable().optional(),
  imageId:     z.string().max(300).nullable().optional(),
  inStock:     z.boolean().optional(),
  featured:    z.boolean().optional(),
  sortOrder:   z.number().int().min(0).optional(),
})

// ─── GET /api/products/[id] ───────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000 })
  if (limited) return limited

  try {
    const { id } = await params
    const isAdmin = validateAdminSecret(req.headers.get('x-admin-secret'))

    const product = await db.product.findUnique({
      where: { id, ...(!isAdmin && { deletedAt: null }) },
    })
    if (!product) return err('Product not found', 404)

    return ok(product)
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return err('Failed to fetch product', 500)
  }
}

// ─── PUT /api/products/[id] ───────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  const { data, error } = await parseBody(req, UpdateProductSchema)
  if (error) return error

  try {
    const { id } = await params
    const existing = await db.product.findUnique({ where: { id } })
    if (!existing) return err('Product not found', 404)

    const product = await db.product.update({ where: { id }, data })

    await db.auditLog.create({
      data: {
        action: 'UPDATE', entity: 'Product', entityId: id, productId: id,
        changes: {
          before: { title: existing.title, price: existing.price, inStock: existing.inStock, category: existing.category },
          after:  { title: product.title,  price: product.price,  inStock: product.inStock,  category: product.category },
        },
        actorIp: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? null,
      },
    }).catch(() => {})

    return ok(product)
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error)
    return err('Failed to update product', 500)
  }
}

// ─── PATCH /api/products/[id] — quick partial update (e.g. stock toggle) ─────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  const { data, error } = await parseBody(req, UpdateProductSchema)
  if (error) return error

  try {
    const { id } = await params
    const existing = await db.product.findUnique({ where: { id } })
    if (!existing) return err('Product not found', 404)

    const product = await db.product.update({ where: { id }, data })

    await db.auditLog.create({
      data: {
        action: 'UPDATE', entity: 'Product', entityId: id, productId: id,
        changes: { patch: data },
        actorIp: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? null,
      },
    }).catch(() => {})

    return ok(product)
  } catch (error) {
    console.error('PATCH /api/products/[id] error:', error)
    return err('Failed to patch product', 500)
  }
}

// ─── DELETE /api/products/[id] — soft delete ─────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  try {
    const { id } = await params
    const product = await db.product.findUnique({ where: { id } })
    if (!product) return err('Product not found', 404)
    if (product.deletedAt) return err('Product already deleted', 409)

    await db.product.update({
      where: { id },
      data: { deletedAt: new Date(), inStock: false },
    })

    await db.auditLog.create({
      data: {
        action: 'DELETE', entity: 'Product', entityId: id, productId: id,
        actorIp: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? null,
      },
    }).catch(() => {})

    return ok({ success: true })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    return err('Failed to delete product', 500)
  }
}
