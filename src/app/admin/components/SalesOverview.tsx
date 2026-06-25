'use client'

import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useSalesData } from '@/hooks/useSalesData'
import type { Period } from '@/lib/sales-aggregator'
import type { SalesResponse } from '@/hooks/useSalesData'

// ─── TimePeriodSelector ───────────────────────────────────────────────────────

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: 'Day', value: 'daily' },
  { label: 'Week', value: 'weekly' },
  { label: 'Month', value: 'monthly' },
]

function TimePeriodSelector({
  activePeriod,
  onPeriodChange,
}: {
  activePeriod: Period
  onPeriodChange: (period: Period) => void
}) {
  return (
    <div className="flex items-center gap-1 bg-slate-800/60 rounded-xl p-1">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onPeriodChange(option.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activePeriod === option.value
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// ─── SummaryCards ─────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return `₹${value.toFixed(2)}`
}

interface SummaryCardItem {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

function SummaryCards({ summary }: { summary: SalesResponse['summary'] }) {
  const cards: SummaryCardItem[] = [
    {
      label: 'Total Orders',
      value: String(summary.totalOrders),
      icon: ShoppingCart,
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      icon: DollarSign,
    },
    {
      label: 'Avg. Order Value',
      value: formatCurrency(summary.averageOrderValue),
      icon: TrendingUp,
    },
    {
      label: 'Unique Products Sold',
      value: String(summary.uniqueProductsSold),
      icon: Package,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <card.icon className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-sm font-medium text-slate-400 mt-1">{card.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

// ─── BestProductsList ─────────────────────────────────────────────────────────

function BestProductsList({ bestProducts }: { bestProducts: SalesResponse['bestProducts'] }) {
  if (!bestProducts || bestProducts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Best Performing Products</h3>
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
          No sales data available
        </div>
      </div>
    )
  }

  // Prepare chart data — top 10 ranked by quantity (already sorted from API)
  const chartData = bestProducts.slice(0, 10).map((product, index) => ({
    name: product.productName.length > 16
      ? product.productName.substring(0, 16) + '…'
      : product.productName,
    fullName: product.productName,
    quantity: product.totalQuantity,
    revenue: product.totalRevenue,
    rank: index + 1,
  }))

  return (
    <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-white mb-4">Best Performing Products</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar Chart */}
        <div className="w-full">
          <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 36)}>
            <BarChart
              data={chartData}
              layout="vertical"
              barSize={18}
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#06b6d4' }}
                formatter={(value: any, name: any) => {
                  if (name === 'quantity') return [`${value} units`, 'Quantity']
                  return [`₹${Number(value).toFixed(2)}`, 'Revenue']
                }}
                labelFormatter={(_: any, payload: any) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullName
                  }
                  return ''
                }}
              />
              <Bar dataKey="quantity" radius={[0, 6, 6, 0]} fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ranked List */}
        <div className="space-y-2">
          {bestProducts.slice(0, 10).map((product, index) => (
            <div
              key={product.productName}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
            >
              <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {product.productName}
                </p>
                <p className="text-xs text-slate-500">
                  {product.totalQuantity} units · {product.orderCount} orders
                </p>
              </div>
              <span className="text-sm font-semibold text-cyan-400 shrink-0">
                ₹{product.totalRevenue.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SalesTrendCharts ─────────────────────────────────────────────────────────

function SalesTrendCharts({ timeSeries }: { timeSeries: SalesResponse['timeSeries'] }) {
  if (!timeSeries || timeSeries.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Sales Trends</h3>
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
          No sales data available
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Bar chart — Order Count */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Order Count</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={timeSeries} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={30}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
              itemStyle={{ color: '#06b6d4' }}
              formatter={(value: number) => [`${value} orders`, 'Orders']}
            />
            <Bar dataKey="orderCount" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line chart — Revenue */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Revenue (₹)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={50}
              tickFormatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
            />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
              itemStyle={{ color: '#06b6d4' }}
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue']}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── SalesOverview ────────────────────────────────────────────────────────────

export function SalesOverview() {
  const { data, loading, error, period, setPeriod, retry } = useSalesData()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Header with period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Sales Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track your sales performance</p>
        </div>
        <TimePeriodSelector activePeriod={period} onPeriodChange={setPeriod} />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading sales data...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-8 flex flex-col items-center gap-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-red-300">{error}</p>
            <p className="text-xs text-slate-500 mt-1">Unable to load sales data</p>
          </div>
          <button
            onClick={retry}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Data loaded — render sub-sections */}
      {!loading && !error && data && (
        <div className="space-y-5">
          {/* Summary Cards */}
          <SummaryCards summary={data.summary} />

          {/* Sales Trend Charts */}
          <SalesTrendCharts timeSeries={data.timeSeries} />

          {/* Best Products List */}
          <BestProductsList bestProducts={data.bestProducts} />
        </div>
      )}

      {/* Empty state — data loaded but no orders */}
      {!loading && !error && data && data.summary.totalOrders === 0 && (
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-8 flex flex-col items-center gap-3">
          <p className="text-sm text-slate-400">No sales data available for the selected period</p>
        </div>
      )}
    </motion.div>
  )
}
