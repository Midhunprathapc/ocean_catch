/**
 * Shared API utilities:
 *  - rate limiting (in-memory, per IP)
 *  - Zod request body parser
 *  - standard JSON response helpers
 *  - CORS headers
 */

import { NextRequest, NextResponse } from 'next/server'
import { z, ZodSchema } from 'zod'

// ─── CORS ─────────────────────────────────────────────────────────────────────
export function withCors(res: NextResponse): NextResponse {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret')
  return res
}

export function corsOptions(): NextResponse {
  return withCors(new NextResponse(null, { status: 204 }))
}

// ─── Standard response helpers ────────────────────────────────────────────────
export function ok<T>(data: T, status = 200): NextResponse {
  return withCors(NextResponse.json(data, { status }))
}

export function err(message: string, status: number): NextResponse {
  return withCors(NextResponse.json({ error: message }, { status }))
}

// ─── Zod body parser ─────────────────────────────────────────────────────────
export async function parseBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return { data: null, error: err('Invalid JSON body', 400) }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const messages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
    return { data: null, error: err(messages.join('; '), 422) }
  }
  return { data: result.data, error: null }
}

// ─── In-memory rate limiter ───────────────────────────────────────────────────
// Simple sliding window — resets per interval. For production use
// an edge-compatible store like Upstash Redis.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

interface RateLimitOptions {
  /** Max requests per window. Default: 60 */
  limit?: number
  /** Window duration in ms. Default: 60_000 (1 min) */
  windowMs?: number
}

export function rateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): NextResponse | null {
  const { limit = 60, windowMs = 60_000 } = options
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const key = ip
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return null // allowed
  }

  entry.count++
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    const res = err('Too many requests — slow down', 429)
    res.headers.set('Retry-After', String(retryAfter))
    return res
  }
  return null // allowed
}

// ─── Stricter rate limit for write/admin endpoints ────────────────────────────
export function adminRateLimit(req: NextRequest): NextResponse | null {
  return rateLimit(req, { limit: 30, windowMs: 60_000 })
}

// ─── Cleanup stale entries every 5 minutes ───────────────────────────────────
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of rateLimitStore.entries()) {
      if (now > val.resetAt) rateLimitStore.delete(key)
    }
  }, 5 * 60_000)
}
