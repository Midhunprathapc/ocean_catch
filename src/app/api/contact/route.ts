import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, parseBody, rateLimit, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

const ContactSchema = z.object({
  name:    z.string().min(1, 'Name is required').max(100).trim(),
  phone:   z.string().max(20).trim().optional().nullable(),
  email:   z.string().email('Invalid email').optional().nullable()
             .or(z.literal('').transform(() => null)),
  subject: z.string().max(100).trim().optional().nullable(),
  message: z.string().min(1, 'Message is required').max(2000).trim(),
})

// ─── POST /api/contact — public: submit contact form ─────────────────────────
export async function POST(req: NextRequest) {
  // Stricter rate limit for form submissions: 5 per 10 minutes per IP
  const limited = rateLimit(req, { limit: 5, windowMs: 10 * 60_000 })
  if (limited) return limited

  const { data, error } = await parseBody(req, ContactSchema)
  if (error) return error

  try {
    const entry = await db.contactMessage.create({ data })
    return ok({ success: true, id: entry.id }, 201)
  } catch (e) {
    console.error('POST /api/contact error:', e)
    return err('Failed to submit message', 500)
  }
}

// ─── GET /api/contact — admin: list all messages ─────────────────────────────
export async function GET(req: NextRequest) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  try {
    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50'))

    const where = unreadOnly ? { isRead: false } : {}

    const [messages, total, unread] = await Promise.all([
      db.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.contactMessage.count({ where }),
      db.contactMessage.count({ where: { isRead: false } }),
    ])

    return ok({ messages, total, unread, page, limit })
  } catch (e) {
    console.error('GET /api/contact error:', e)
    return err('Failed to fetch messages', 500)
  }
}
