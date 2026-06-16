import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

// GET /api/admin/stats — dashboard overview numbers
export async function GET(req: NextRequest) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  try {
    const [
      totalProducts,
      inStockCount,
      outOfStockCount,
      deletedCount,
      featuredCount,
      categoryBreakdown,
      totalOrders,
      ordersByStatus,
      recentOrders,
      unreadMessages,
      totalMessages,
      recentProducts,
      avgPrice,
    ] = await Promise.all([
      db.product.count({ where: { deletedAt: null } }),
      db.product.count({ where: { deletedAt: null, inStock: true } }),
      db.product.count({ where: { deletedAt: null, inStock: false } }),
      db.product.count({ where: { deletedAt: { not: null } } }),
      db.product.count({ where: { deletedAt: null, featured: true } }),

      // Products per category
      db.product.groupBy({
        by: ['category'],
        where: { deletedAt: null },
        _count: { _all: true },
        orderBy: { _count: { category: 'desc' } },
      }),

      db.order.count(),
      db.order.groupBy({ by: ['status'], _count: { _all: true } }),

      // 5 most recent orders
      db.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true },
      }),

      db.contactMessage.count({ where: { isRead: false } }),
      db.contactMessage.count(),

      // 5 most recently added products
      db.product.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, price: true, unit: true, inStock: true, imageUrl: true, category: true, createdAt: true },
      }),

      // Average price of active products
      db.product.aggregate({
        where: { deletedAt: null },
        _avg: { price: true },
      }),
    ])

    return ok({
      products: {
        total:    totalProducts,
        inStock:  inStockCount,
        outOfStock: outOfStockCount,
        deleted:  deletedCount,
        featured: featuredCount,
        avgPrice: avgPrice._avg.price ?? 0,
        byCategory: Object.fromEntries(
          categoryBreakdown.map(c => [c.category, c._count._all])
        ),
        recent: recentProducts,
      },
      orders: {
        total:  totalOrders,
        byStatus: Object.fromEntries(
          ordersByStatus.map(s => [s.status, s._count._all])
        ),
        recent: recentOrders,
      },
      messages: {
        total:  totalMessages,
        unread: unreadMessages,
      },
    })
  } catch (e) {
    console.error('GET /api/admin/stats error:', e)
    return err('Failed to fetch stats', 500)
  }
}
