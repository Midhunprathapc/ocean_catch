import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, parseBody, rateLimit, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

const UpdateSettingsSchema = z.object({
  phone:        z.string().max(20).trim().optional(),
  email:        z.string().email().optional(),
  address:      z.string().max(500).trim().nullable().optional(),
  facebookUrl:  z.string().url().nullable().optional()
                  .or(z.literal('').transform(() => null)),
  instagramUrl: z.string().url().nullable().optional()
                  .or(z.literal('').transform(() => null)),
  whatsappUrl:  z.string().url().nullable().optional()
                  .or(z.literal('').transform(() => null)),
})

// ─── GET /api/settings — public: read site settings ──────────────────────────
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000 })
  if (limited) return limited

  try {
    const settings = await db.siteSettings.findUnique({ where: { id: 'singleton' } })
    if (!settings) return err('Settings not found', 404)
    return ok(settings)
  } catch (e) {
    console.error('GET /api/settings error:', e)
    return err('Failed to fetch settings', 500)
  }
}

// ─── PATCH /api/settings — admin: update site settings ───────────────────────
export async function PATCH(req: NextRequest) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  const { data, error } = await parseBody(req, UpdateSettingsSchema)
  if (error) return error

  try {
    const settings = await db.siteSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    })
    return ok(settings)
  } catch (e) {
    console.error('PATCH /api/settings error:', e)
    return err('Failed to update settings', 500)
  }
}
