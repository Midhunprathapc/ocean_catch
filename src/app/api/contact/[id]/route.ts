import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, parseBody, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

const PatchMessageSchema = z.object({
  isRead:    z.boolean().optional(),
  repliedAt: z.string().datetime().optional().nullable(),
})

// ─── PATCH /api/contact/[id] — mark read / set repliedAt ─────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  const { data, error } = await parseBody(req, PatchMessageSchema)
  if (error) return error

  try {
    const { id } = await params
    const existing = await db.contactMessage.findUnique({ where: { id } })
    if (!existing) return err('Message not found', 404)

    const updated = await db.contactMessage.update({
      where: { id },
      data: {
        ...(data.isRead    !== undefined && { isRead: data.isRead }),
        ...(data.repliedAt !== undefined && {
          repliedAt: data.repliedAt ? new Date(data.repliedAt) : null,
        }),
      },
    })

    return ok(updated)
  } catch (e) {
    console.error('PATCH /api/contact/[id] error:', e)
    return err('Failed to update message', 500)
  }
}

// ─── DELETE /api/contact/[id] — admin: delete a message ──────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  try {
    const { id } = await params
    const existing = await db.contactMessage.findUnique({ where: { id } })
    if (!existing) return err('Message not found', 404)

    await db.contactMessage.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    console.error('DELETE /api/contact/[id] error:', e)
    return err('Failed to delete message', 500)
  }
}
