import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

// GET /api — health check with real DB ping
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  const start = Date.now()
  try {
    await db.$queryRaw`SELECT 1`
    return NextResponse.json({
      app:        'Sea Harvest Premium Seafoods API',
      version:    '2.0.0',
      status:     'ok',
      db:         'connected',
      latency_ms: Date.now() - start,
      timestamp:  new Date().toISOString(),
      endpoints: [
        'GET  /api',
        'GET  /api/products',
        'POST /api/products',
        'GET  /api/products/[id]',
        'PUT  /api/products/[id]',
        'PATCH /api/products/[id]',
        'DELETE /api/products/[id]',
        'GET  /api/settings',
        'PATCH /api/settings',
        'POST /api/contact',
        'GET  /api/contact',
        'PATCH /api/contact/[id]',
        'DELETE /api/contact/[id]',
        'POST /api/orders',
        'GET  /api/orders',
        'GET  /api/orders/[id]',
        'PATCH /api/orders/[id]',
        'DELETE /api/orders/[id]',
        'GET  /api/admin/stats',
        'POST /api/upload',
      ],
    })
  } catch {
    return NextResponse.json({
      app:       'OceanCatch API',
      status:    'degraded',
      db:        'unreachable',
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }
}
