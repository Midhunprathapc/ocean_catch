import { describe, it, expect } from 'vitest'
import {
  validatePeriod,
  validateDateRange,
  getDefaultDateRange,
  filterQualifyingOrders,
  getPeriodLabel,
  aggregateByPeriod,
  computeBestProducts,
  computeSummaryStats,
  OrderData,
} from '@/lib/sales-aggregator'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeOrder(overrides: Partial<OrderData> = {}): OrderData {
  return {
    id: 'order-1',
    status: 'CONFIRMED',
    totalAmount: 500,
    createdAt: new Date('2024-06-15'),
    items: [
      { productId: 'p1', productName: 'Salmon', price: 250, quantity: 2 },
    ],
    ...overrides,
  }
}

// ─── validatePeriod ───────────────────────────────────────────────────────────

describe('validatePeriod', () => {
  it('returns true for "daily"', () => {
    expect(validatePeriod('daily')).toBe(true)
  })

  it('returns true for "weekly"', () => {
    expect(validatePeriod('weekly')).toBe(true)
  })

  it('returns true for "monthly"', () => {
    expect(validatePeriod('monthly')).toBe(true)
  })

  it('returns false for invalid periods', () => {
    expect(validatePeriod('yearly')).toBe(false)
    expect(validatePeriod('')).toBe(false)
    expect(validatePeriod('DAILY')).toBe(false)
    expect(validatePeriod('bi-weekly')).toBe(false)
  })
})

// ─── validateDateRange ────────────────────────────────────────────────────────

describe('validateDateRange', () => {
  it('returns valid for a correct date range', () => {
    const result = validateDateRange('2024-01-01', '2024-06-30')
    expect(result).toEqual({ valid: true })
  })

  it('returns valid when start equals end', () => {
    const result = validateDateRange('2024-06-15', '2024-06-15')
    expect(result).toEqual({ valid: true })
  })

  it('returns error for non-ISO format', () => {
    const result = validateDateRange('01/01/2024', '06/30/2024')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Invalid date range')
  })

  it('returns error when start is after end', () => {
    const result = validateDateRange('2024-06-30', '2024-01-01')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Start date must be before end date')
  })

  it('returns error when span exceeds 365 days', () => {
    const result = validateDateRange('2022-01-01', '2024-01-02')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Date range cannot exceed 365 days')
  })

  it('returns valid for exactly 365 days', () => {
    const result = validateDateRange('2024-01-01', '2024-12-31')
    expect(result).toEqual({ valid: true })
  })
})

// ─── getDefaultDateRange ──────────────────────────────────────────────────────

describe('getDefaultDateRange', () => {
  it('returns 30-day range for daily', () => {
    const { startDate, endDate } = getDefaultDateRange('daily')
    const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    expect(diffDays).toBeGreaterThanOrEqual(29)
    expect(diffDays).toBeLessThanOrEqual(31)
  })

  it('returns 12-week range for weekly', () => {
    const { startDate, endDate } = getDefaultDateRange('weekly')
    const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    expect(diffDays).toBeGreaterThanOrEqual(83)
    expect(diffDays).toBeLessThanOrEqual(85)
  })

  it('returns 12-month range for monthly', () => {
    const { startDate, endDate } = getDefaultDateRange('monthly')
    const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    expect(diffDays).toBeGreaterThanOrEqual(360)
    expect(diffDays).toBeLessThanOrEqual(370)
  })

  it('endDate is today or later', () => {
    const { endDate } = getDefaultDateRange('daily')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    expect(endDate.getTime()).toBeGreaterThanOrEqual(today.getTime())
  })
})

// ─── filterQualifyingOrders ───────────────────────────────────────────────────

describe('filterQualifyingOrders', () => {
  it('keeps CONFIRMED orders', () => {
    const orders = [makeOrder({ status: 'CONFIRMED' })]
    expect(filterQualifyingOrders(orders)).toHaveLength(1)
  })

  it('keeps PROCESSING orders', () => {
    const orders = [makeOrder({ status: 'PROCESSING' })]
    expect(filterQualifyingOrders(orders)).toHaveLength(1)
  })

  it('keeps DELIVERED orders', () => {
    const orders = [makeOrder({ status: 'DELIVERED' })]
    expect(filterQualifyingOrders(orders)).toHaveLength(1)
  })

  it('excludes PENDING orders', () => {
    const orders = [makeOrder({ status: 'PENDING' })]
    expect(filterQualifyingOrders(orders)).toHaveLength(0)
  })

  it('excludes CANCELLED orders', () => {
    const orders = [makeOrder({ status: 'CANCELLED' })]
    expect(filterQualifyingOrders(orders)).toHaveLength(0)
  })

  it('filters mixed statuses correctly', () => {
    const orders = [
      makeOrder({ id: '1', status: 'CONFIRMED' }),
      makeOrder({ id: '2', status: 'PENDING' }),
      makeOrder({ id: '3', status: 'DELIVERED' }),
      makeOrder({ id: '4', status: 'CANCELLED' }),
      makeOrder({ id: '5', status: 'PROCESSING' }),
    ]
    const result = filterQualifyingOrders(orders)
    expect(result).toHaveLength(3)
    expect(result.map(o => o.id)).toEqual(['1', '3', '5'])
  })
})

// ─── getPeriodLabel ───────────────────────────────────────────────────────────

describe('getPeriodLabel', () => {
  it('returns ISO date for daily', () => {
    const date = new Date('2024-06-15')
    expect(getPeriodLabel(date, 'daily')).toBe('2024-06-15')
  })

  it('returns ISO week for weekly', () => {
    // June 15, 2024 is a Saturday in ISO week 24
    const date = new Date('2024-06-15')
    expect(getPeriodLabel(date, 'weekly')).toBe('2024-W24')
  })

  it('returns year-month for monthly', () => {
    const date = new Date('2024-06-15')
    expect(getPeriodLabel(date, 'monthly')).toBe('2024-06')
  })

  it('handles single-digit months with padding', () => {
    const date = new Date('2024-01-05')
    expect(getPeriodLabel(date, 'monthly')).toBe('2024-01')
    expect(getPeriodLabel(date, 'daily')).toBe('2024-01-05')
  })
})

// ─── aggregateByPeriod ────────────────────────────────────────────────────────

describe('aggregateByPeriod', () => {
  it('groups orders by day', () => {
    const orders = [
      makeOrder({ id: '1', createdAt: new Date('2024-06-15'), totalAmount: 100 }),
      makeOrder({ id: '2', createdAt: new Date('2024-06-15'), totalAmount: 200 }),
      makeOrder({ id: '3', createdAt: new Date('2024-06-16'), totalAmount: 150 }),
    ]
    const result = aggregateByPeriod(orders, 'daily')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ period: '2024-06-15', orderCount: 2, revenue: 300 })
    expect(result[1]).toEqual({ period: '2024-06-16', orderCount: 1, revenue: 150 })
  })

  it('groups orders by month', () => {
    const orders = [
      makeOrder({ id: '1', createdAt: new Date('2024-05-10'), totalAmount: 100 }),
      makeOrder({ id: '2', createdAt: new Date('2024-06-15'), totalAmount: 200 }),
      makeOrder({ id: '3', createdAt: new Date('2024-06-20'), totalAmount: 300 }),
    ]
    const result = aggregateByPeriod(orders, 'monthly')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ period: '2024-05', orderCount: 1, revenue: 100 })
    expect(result[1]).toEqual({ period: '2024-06', orderCount: 2, revenue: 500 })
  })

  it('returns empty array for no qualifying orders', () => {
    const orders = [makeOrder({ status: 'CANCELLED' })]
    expect(aggregateByPeriod(orders, 'daily')).toEqual([])
  })

  it('returns empty array for empty input', () => {
    expect(aggregateByPeriod([], 'daily')).toEqual([])
  })

  it('excludes non-qualifying orders from aggregation', () => {
    const orders = [
      makeOrder({ id: '1', status: 'CONFIRMED', totalAmount: 100 }),
      makeOrder({ id: '2', status: 'PENDING', totalAmount: 9999 }),
    ]
    const result = aggregateByPeriod(orders, 'daily')
    expect(result).toHaveLength(1)
    expect(result[0].revenue).toBe(100)
  })

  it('treats null totalAmount as 0', () => {
    const orders = [makeOrder({ totalAmount: null })]
    const result = aggregateByPeriod(orders, 'daily')
    expect(result[0].revenue).toBe(0)
  })
})

// ─── computeBestProducts ──────────────────────────────────────────────────────

describe('computeBestProducts', () => {
  it('ranks products by total quantity desc', () => {
    const orders = [
      makeOrder({
        id: '1',
        items: [
          { productId: 'p1', productName: 'Salmon', price: 300, quantity: 5 },
          { productId: 'p2', productName: 'Tuna', price: 200, quantity: 10 },
        ],
      }),
    ]
    const result = computeBestProducts(orders)
    expect(result[0].productName).toBe('Tuna')
    expect(result[1].productName).toBe('Salmon')
  })

  it('uses revenue as tiebreaker when quantity is equal', () => {
    const orders = [
      makeOrder({
        id: '1',
        items: [
          { productId: 'p1', productName: 'Salmon', price: 500, quantity: 3 },
          { productId: 'p2', productName: 'Tuna', price: 200, quantity: 3 },
        ],
      }),
    ]
    const result = computeBestProducts(orders)
    expect(result[0].productName).toBe('Salmon')
    expect(result[0].totalRevenue).toBe(1500)
    expect(result[1].productName).toBe('Tuna')
    expect(result[1].totalRevenue).toBe(600)
  })

  it('limits results to 10 by default', () => {
    const items = Array.from({ length: 15 }, (_, i) => ({
      productId: `p${i}`,
      productName: `Product ${i}`,
      price: 100,
      quantity: 15 - i,
    }))
    const orders = [makeOrder({ items })]
    const result = computeBestProducts(orders)
    expect(result).toHaveLength(10)
  })

  it('accepts custom limit', () => {
    const items = Array.from({ length: 5 }, (_, i) => ({
      productId: `p${i}`,
      productName: `Product ${i}`,
      price: 100,
      quantity: 5 - i,
    }))
    const orders = [makeOrder({ items })]
    const result = computeBestProducts(orders, 3)
    expect(result).toHaveLength(3)
  })

  it('counts distinct orders per product', () => {
    const orders = [
      makeOrder({
        id: 'o1',
        items: [{ productId: 'p1', productName: 'Salmon', price: 300, quantity: 2 }],
      }),
      makeOrder({
        id: 'o2',
        items: [{ productId: 'p1', productName: 'Salmon', price: 300, quantity: 1 }],
      }),
    ]
    const result = computeBestProducts(orders)
    expect(result[0].orderCount).toBe(2)
    expect(result[0].totalQuantity).toBe(3)
    expect(result[0].totalRevenue).toBe(900)
  })

  it('returns empty array when no qualifying orders', () => {
    const orders = [makeOrder({ status: 'CANCELLED' })]
    expect(computeBestProducts(orders)).toEqual([])
  })
})

// ─── computeSummaryStats ──────────────────────────────────────────────────────

describe('computeSummaryStats', () => {
  it('computes correct stats for qualifying orders', () => {
    const orders = [
      makeOrder({ id: '1', totalAmount: 500, items: [{ productId: 'p1', productName: 'Salmon', price: 250, quantity: 2 }] }),
      makeOrder({ id: '2', totalAmount: 300, items: [{ productId: 'p2', productName: 'Tuna', price: 300, quantity: 1 }] }),
    ]
    const stats = computeSummaryStats(orders)
    expect(stats.totalOrders).toBe(2)
    expect(stats.totalRevenue).toBe(800)
    expect(stats.averageOrderValue).toBe(400)
    expect(stats.uniqueProductsSold).toBe(2)
  })

  it('returns zeros for empty input', () => {
    const stats = computeSummaryStats([])
    expect(stats).toEqual({
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      uniqueProductsSold: 0,
    })
  })

  it('excludes non-qualifying orders', () => {
    const orders = [
      makeOrder({ id: '1', status: 'CONFIRMED', totalAmount: 500 }),
      makeOrder({ id: '2', status: 'CANCELLED', totalAmount: 9999 }),
    ]
    const stats = computeSummaryStats(orders)
    expect(stats.totalOrders).toBe(1)
    expect(stats.totalRevenue).toBe(500)
  })

  it('counts unique productIds across orders', () => {
    const orders = [
      makeOrder({
        id: '1',
        items: [
          { productId: 'p1', productName: 'Salmon', price: 300, quantity: 1 },
          { productId: 'p2', productName: 'Tuna', price: 200, quantity: 1 },
        ],
      }),
      makeOrder({
        id: '2',
        items: [
          { productId: 'p1', productName: 'Salmon', price: 300, quantity: 2 },
          { productId: 'p3', productName: 'Prawns', price: 400, quantity: 1 },
        ],
      }),
    ]
    const stats = computeSummaryStats(orders)
    expect(stats.uniqueProductsSold).toBe(3)
  })

  it('handles null totalAmount as 0', () => {
    const orders = [makeOrder({ totalAmount: null })]
    const stats = computeSummaryStats(orders)
    expect(stats.totalRevenue).toBe(0)
    expect(stats.averageOrderValue).toBe(0)
  })
})
