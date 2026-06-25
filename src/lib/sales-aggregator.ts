/**
 * Sales Aggregation Utility Module
 *
 * Pure functions for computing sales metrics from order data.
 * No database dependencies — receives data, returns computed results.
 */

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface OrderData {
  id: string
  status: string
  totalAmount: number | null
  createdAt: Date
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
  }>
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface AggregationEntry {
  period: string
  orderCount: number
  revenue: number
}

export interface ProductPerformance {
  productName: string
  totalQuantity: number
  totalRevenue: number
  orderCount: number
}

export interface SummaryStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  uniqueProductsSold: number
}

// ─── Qualifying statuses ──────────────────────────────────────────────────────

const QUALIFYING_STATUSES = ['CONFIRMED', 'PROCESSING', 'DELIVERED'] as const

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Returns true only for "daily", "weekly", "monthly".
 */
export function validatePeriod(period: string): period is Period {
  return period === 'daily' || period === 'weekly' || period === 'monthly'
}

/**
 * Checks ISO format (YYYY-MM-DD), start <= end, span <= 365 days.
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/

  if (!isoDateRegex.test(startDate) || !isoDateRegex.test(endDate)) {
    return { valid: false, error: 'Invalid date range' }
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid date range' }
  }

  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' }
  }

  const diffMs = end.getTime() - start.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffDays > 365) {
    return { valid: false, error: 'Date range cannot exceed 365 days' }
  }

  return { valid: true }
}

// ─── Default date ranges ──────────────────────────────────────────────────────

/**
 * Returns the default date range based on period:
 * - daily: last 30 days
 * - weekly: last 12 weeks
 * - monthly: last 12 months
 */
export function getDefaultDateRange(period: Period): { startDate: Date; endDate: Date } {
  const endDate = new Date()
  endDate.setHours(23, 59, 59, 999)

  const startDate = new Date()

  switch (period) {
    case 'daily':
      startDate.setDate(startDate.getDate() - 30)
      break
    case 'weekly':
      startDate.setDate(startDate.getDate() - 12 * 7)
      break
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 12)
      break
  }

  startDate.setHours(0, 0, 0, 0)
  return { startDate, endDate }
}

// ─── Filtering ────────────────────────────────────────────────────────────────

/**
 * Keeps only orders with status CONFIRMED, PROCESSING, or DELIVERED.
 */
export function filterQualifyingOrders(orders: OrderData[]): OrderData[] {
  return orders.filter(order =>
    QUALIFYING_STATUSES.includes(order.status as typeof QUALIFYING_STATUSES[number])
  )
}

// ─── Period label computation ─────────────────────────────────────────────────

/**
 * Returns a period label for the given date:
 * - daily: ISO date string "YYYY-MM-DD"
 * - weekly: ISO week identifier "YYYY-Www"
 * - monthly: year-month "YYYY-MM"
 */
export function getPeriodLabel(date: Date, period: Period): string {
  switch (period) {
    case 'daily':
      return formatISODate(date)
    case 'weekly':
      return getISOWeekLabel(date)
    case 'monthly':
      return formatYearMonth(date)
  }
}

function formatISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatYearMonth(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function getISOWeekLabel(date: Date): string {
  const { year, week } = getISOWeekNumber(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

/**
 * Computes the ISO 8601 week number for a given date.
 * ISO weeks start on Monday, and week 1 contains the first Thursday of the year.
 */
function getISOWeekNumber(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  // Set to nearest Thursday: current date + 4 - current day number (Monday=1, Sunday=7)
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { year: d.getUTCFullYear(), week: weekNum }
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

/**
 * Groups qualifying orders by period label, computes orderCount and revenue per bucket.
 * Returns entries sorted chronologically by period label.
 */
export function aggregateByPeriod(orders: OrderData[], period: Period): AggregationEntry[] {
  const qualifying = filterQualifyingOrders(orders)
  const buckets = new Map<string, { orderCount: number; revenue: number }>()

  for (const order of qualifying) {
    const label = getPeriodLabel(order.createdAt, period)
    const existing = buckets.get(label)

    if (existing) {
      existing.orderCount++
      existing.revenue += order.totalAmount ?? 0
    } else {
      buckets.set(label, {
        orderCount: 1,
        revenue: order.totalAmount ?? 0,
      })
    }
  }

  const entries: AggregationEntry[] = []
  for (const [periodLabel, data] of buckets) {
    entries.push({
      period: periodLabel,
      orderCount: data.orderCount,
      revenue: data.revenue,
    })
  }

  // Sort chronologically by period label (ISO strings sort naturally)
  entries.sort((a, b) => a.period.localeCompare(b.period))

  return entries
}

// ─── Best Products ────────────────────────────────────────────────────────────

/**
 * Ranks products by total quantity sold (desc), with total revenue (desc) as tiebreaker.
 * Returns at most `limit` entries (default 10).
 */
export function computeBestProducts(orders: OrderData[], limit: number = 10): ProductPerformance[] {
  const qualifying = filterQualifyingOrders(orders)

  const productMap = new Map<string, {
    productName: string
    totalQuantity: number
    totalRevenue: number
    orderIds: Set<string>
  }>()

  for (const order of qualifying) {
    for (const item of order.items) {
      const existing = productMap.get(item.productName)

      if (existing) {
        existing.totalQuantity += item.quantity
        existing.totalRevenue += item.price * item.quantity
        existing.orderIds.add(order.id)
      } else {
        productMap.set(item.productName, {
          productName: item.productName,
          totalQuantity: item.quantity,
          totalRevenue: item.price * item.quantity,
          orderIds: new Set([order.id]),
        })
      }
    }
  }

  const products: ProductPerformance[] = []
  for (const data of productMap.values()) {
    products.push({
      productName: data.productName,
      totalQuantity: data.totalQuantity,
      totalRevenue: data.totalRevenue,
      orderCount: data.orderIds.size,
    })
  }

  // Sort by total quantity desc, then by revenue desc as tiebreaker
  products.sort((a, b) => {
    if (b.totalQuantity !== a.totalQuantity) {
      return b.totalQuantity - a.totalQuantity
    }
    return b.totalRevenue - a.totalRevenue
  })

  return products.slice(0, limit)
}

// ─── Summary Statistics ───────────────────────────────────────────────────────

/**
 * Computes totalOrders, totalRevenue, averageOrderValue, uniqueProductsSold
 * from qualifying orders.
 */
export function computeSummaryStats(orders: OrderData[]): SummaryStats {
  const qualifying = filterQualifyingOrders(orders)

  const totalOrders = qualifying.length
  const totalRevenue = qualifying.reduce(
    (sum, order) => sum + (order.totalAmount ?? 0),
    0
  )
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const productIds = new Set<string>()
  for (const order of qualifying) {
    for (const item of order.items) {
      productIds.add(item.productId)
    }
  }

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    uniqueProductsSold: productIds.size,
  }
}
