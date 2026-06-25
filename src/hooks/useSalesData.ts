import { useState, useEffect, useRef, useCallback } from 'react'
import type { Period } from '@/lib/sales-aggregator'

// ─── Response shape from /api/admin/sales ─────────────────────────────────────

export interface SalesResponse {
  summary: {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    uniqueProductsSold: number
  }
  timeSeries: Array<{
    period: string
    orderCount: number
    revenue: number
  }>
  bestProducts: Array<{
    productName: string
    totalQuantity: number
    totalRevenue: number
    orderCount: number
  }>
}

// ─── Hook return type ─────────────────────────────────────────────────────────

export interface UseSalesDataReturn {
  data: SalesResponse | null
  loading: boolean
  error: string | null
  period: Period
  setPeriod: (p: Period) => void
  retry: () => void
}

// ─── Hook implementation ──────────────────────────────────────────────────────

export function useSalesData(): UseSalesDataReturn {
  const [data, setData] = useState<SalesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('monthly')

  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async (currentPeriod: Period) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const secret = typeof window !== 'undefined'
        ? sessionStorage.getItem('admin_secret') ?? ''
        : ''

      const res = await fetch(`/api/admin/sales?period=${currentPeriod}`, {
        headers: { 'x-admin-secret': secret },
        signal: controller.signal,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? `Failed to fetch sales data (${res.status})`)
      }

      const json: SalesResponse = await res.json()
      setData(json)
      setError(null)
    } catch (err: unknown) {
      // Don't update state if the request was aborted (period changed)
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch sales data')
      setData(null)
    } finally {
      // Only clear loading if this controller wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchData(period)

    return () => {
      // Cleanup: abort on unmount or period change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [period, fetchData])

  const retry = useCallback(() => {
    fetchData(period)
  }, [period, fetchData])

  return { data, loading, error, period, setPeriod, retry }
}
