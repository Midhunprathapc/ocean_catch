import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, parseBody, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

const UpdateOrderSchema = z.object({
  status:      z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED']).optional(),
  notes:       z.string().max(1000).trim().nullable().optional(),
  totalAmount: z.number().positive().nullable().optional(),
})

// ─── GET /api/orders/[id] — admin: single order ───────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  try {
    const { id } = await params
    const order = await db.order.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!order) return err('Order not found', 404)
    return ok(order)
  } catch (e) {
    console.error('GET /api/orders/[id] error:', e)
    return err('Failed to fetch order', 500)
  }
}

// ─── PATCH /api/orders/[id] — admin: update status / notes ───────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  const { data, error } = await parseBody(req, UpdateOrderSchema)
  if (error) return error

  try {
    const { id } = await params
    const existing = await db.order.findUnique({ where: { id } })
    if (!existing) return err('Order not found', 404)

    const order = await db.order.update({
      where: { id },
      data: {
        ...(data.status      !== undefined && { status: data.status }),
        ...(data.notes       !== undefined && { notes: data.notes }),
        ...(data.totalAmount !== undefined && { totalAmount: data.totalAmount }),
      },
      include: { items: true },
    })

    await db.auditLog.create({
      data: {
        action: 'UPDATE', entity: 'Order', entityId: id, orderId: id,
        changes: {
          before: { status: existing.status, notes: existing.notes },
          after:  { status: order.status,    notes: order.notes },
        },
        actorIp: req.headers.get('x-forwarded-for') ?? null,
      },
    }).catch(() => {})

    return ok(order)
  } catch (e) {
    console.error('PATCH /api/orders/[id] error:', e)
    return err('Failed to update order', 500)
  }
}

// ─── DELETE /api/orders/[id] — admin: cancel + delete order ──────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  try {
    const { id } = await params
    const existing = await db.order.findUnique({ where: { id } })
    if (!existing) return err('Order not found', 404)

    await db.order.delete({ where: { id } })

    await db.auditLog.create({
      data: {
        action: 'DELETE', entity: 'Order', entityId: id,
        actorIp: req.headers.get('x-forwarded-for') ?? null,
      },
    }).catch(() => {})

    return ok({ success: true })
  } catch (e) {
    console.error('DELETE /api/orders/[id] error:', e)
    return err('Failed to delete order', 500)
  }
}
