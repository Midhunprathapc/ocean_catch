import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, adminRateLimit, corsOptions } from '@/lib/api'
import {
  validatePeriod,
  validateDateRange,
  getDefaultDateRange,
  aggregateByPeriod,
  computeBestProducts,
  computeSummaryStats,
  type OrderData,
} from '@/lib/sales-aggregator'

export function OPTIONS() { return corsOptions() }

// GET /api/admin/sales — sales analytics aggregation
export async function GET(req: NextRequest) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period')
  const startDateParam = searchParams.get('startDate')
  const endDateParam = searchParams.get('endDate')

  // Validate period (required)
  if (!period) {
    return err('Missing required parameter: period', 400)
  }

  if (!validatePeriod(period)) {
    return err('Invalid period parameter. Must be one of: daily, weekly, monthly', 400)
  }

  // Determine date range
  let startDate: Date
  let endDate: Date

  if (startDateParam && endDateParam) {
    const rangeValidation = validateDateRange(startDateParam, endDateParam)
    if (!rangeValidation.valid) {
      return err(rangeValidation.error!, 400)
    }
    startDate = new Date(startDateParam)
    startDate.setHours(0, 0, 0, 0)
    endDate = new Date(endDateParam)
    endDate.setHours(23, 59, 59, 999)
  } else if (startDateParam || endDateParam) {
    // If only one date param is provided, validate the one provided
    const singleDate = startDateParam || endDateParam
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!isoDateRegex.test(singleDate!)) {
      return err('Invalid date range', 400)
    }
    // Use defaults for the missing date
    const defaults = getDefaultDateRange(period)
    startDate = startDateParam ? new Date(startDateParam) : defaults.startDate
    endDate = endDateParam ? new Date(endDateParam) : defaults.endDate
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)
  } else {
    // No date params — use defaults based on period
    const defaults = getDefaultDateRange(period)
    startDate = defaults.startDate
    endDate = defaults.endDate
  }

  try {
    // Query qualifying orders with their items
    const orders = await db.order.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PROCESSING', 'DELIVERED'] },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    })

    // Map Prisma results to OrderData interface
    const orderData: OrderData[] = orders.map(order => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
    }))

    // Compute aggregations using pure utility functions
    const timeSeries = aggregateByPeriod(orderData, period)
    const bestProducts = computeBestProducts(orderData)
    const summary = computeSummaryStats(orderData)

    return ok({
      summary,
      timeSeries,
      bestProducts,
    })
  } catch (e) {
    console.error('GET /api/admin/sales error:', e)
    return err('Failed to fetch sales data', 500)
  }
}
