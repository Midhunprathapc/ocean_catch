import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, parseBody, rateLimit, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

const OrderItemSchema = z.object({
  productId:   z.string().min(1),
  productName: z.string().min(1).max(200).trim(),
  price:       z.number().positive(),
  unit:        z.string().min(1).max(20),
  quantity:    z.number().positive().default(1),
})

const CreateOrderSchema = z.object({
  customerName:  z.string().min(1).max(100).trim(),
  customerPhone: z.string().min(7).max(20).trim(),
  customerEmail: z.string().email().optional().nullable()
                   .or(z.literal('').transform(() => null)),
  message:       z.string().max(1000).trim().optional().nullable(),
  contactMethod: z.enum(['PHONE', 'WHATSAPP', 'EMAIL']).default('WHATSAPP'),
  items:         z.array(OrderItemSchema).optional(),
})

// ─── POST /api/orders — public: create an order enquiry ──────────────────────
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { limit: 10, windowMs: 60_000 })
  if (limited) return limited

  const { data, error } = await parseBody(req, CreateOrderSchema)
  if (error) return error

  try {
    // Calculate total from items if provided
    const totalAmount = data.items?.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    ) ?? null

    const order = await db.order.create({
      data: {
        customerName:  data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail ?? null,
        message:       data.message ?? null,
        contactMethod: data.contactMethod,
        totalAmount,
        items: data.items?.length ? {
          create: data.items.map(item => ({
            productId:   item.productId,
            productName: item.productName,
            price:       item.price,
            unit:        item.unit,
            quantity:    item.quantity,
          }))
        } : undefined,
      },
      include: { items: true },
    })

    await db.auditLog.create({
      data: {
        action: 'CREATE', entity: 'Order', entityId: order.id, orderId: order.id,
        actorIp: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? null,
      },
    }).catch(() => {})

    return ok(order, 201)
  } catch (e) {
    console.error('POST /api/orders error:', e)
    return err('Failed to create order', 500)
  }
}

// ─── GET /api/orders — admin: list all orders with pagination ─────────────────
export async function GET(req: NextRequest) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')?.trim()
    const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1'))
    const limit  = Math.min(100, parseInt(searchParams.get('limit') ?? '20'))

    const where: Record<string, unknown> = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { customerName:  { contains: search, mode: 'insensitive' } },
          { customerPhone: { contains: search, mode: 'insensitive' } },
          { customerEmail: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ])

    // Count per status for dashboard
    const statusCounts = await db.order.groupBy({
      by: ['status'],
      _count: { _all: true },
    })

    return ok({
      orders, total, page, limit,
      pages: Math.ceil(total / limit),
      statusCounts: Object.fromEntries(
        statusCounts.map(s => [s.status, s._count._all])
      ),
    })
  } catch (e) {
    console.error('GET /api/orders error:', e)
    return err('Failed to fetch orders', 500)
  }
}
