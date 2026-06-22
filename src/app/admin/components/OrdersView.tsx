'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Search, RefreshCw, AlertCircle, MessageCircle,
  FileText, Download, ChevronDown, Check, X, Clock,
  Truck, Package, Phone, Mail, User, Loader2, Plus,
  Eye, Pencil, Trash2, ExternalLink, Filter, Minus, ShoppingCart
} from 'lucide-react'
import { downloadInvoice, type InvoiceData } from '@/lib/invoice'

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderItem {
  id: string
  productName: string
  price: number
  unit: string
  quantity: number
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  message: string | null
  contactMethod: string
  status: string
  totalAmount: number | null
  notes: string | null
  items: OrderItem[]
  createdAt: string
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  PENDING:    { label: 'Pending',    color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20',  icon: Clock    },
  CONFIRMED:  { label: 'Confirmed',  color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20',    icon: Check    },
  PROCESSING: { label: 'Processing', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20',icon: Package  },
  DELIVERED:  { label: 'Delivered',  color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/20',icon: Truck  },
  CANCELLED:  { label: 'Cancelled',  color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',      icon: X       },
}

const ALL_STATUSES = Object.keys(STATUS_META)

// ─── Helper: build invoice data from order ────────────────────────────────────
function toInvoiceData(order: Order): InvoiceData {
  const num = order.id.slice(-8).toUpperCase()
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
  return {
    invoiceNumber: num,
    date,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail,
    items: order.items.length ? order.items : [{
      productName: order.message ?? 'Custom Order',
      price: order.totalAmount ?? 0,
      unit: 'order',
      quantity: 1,
    }],
    totalAmount: order.totalAmount,
    notes: order.notes,
    status: STATUS_META[order.status]?.label ?? order.status,
  }
}

// ─── Helper: build WhatsApp share message ─────────────────────────────────────
function buildWhatsAppMsg(order: Order): string {
  const lines = [
    `🐟 *Sea Harvest Premium Seafoods*`,
    `━━━━━━━━━━━━━━━`,
    `📋 *Invoice #${order.id.slice(-8).toUpperCase()}*`,
    `📅 ${new Date(order.createdAt).toLocaleDateString('en-IN')}`,
    ``,
    `👤 *Customer:* ${order.customerName}`,
    `📞 ${order.customerPhone}`,
    ``,
    `🛒 *Order Details:*`,
  ]
  if (order.items.length) {
    order.items.forEach(item => {
      lines.push(`  • ${item.productName} × ${item.quantity} ${item.unit} — ₹${(item.price * item.quantity).toFixed(2)}`)
    })
  } else if (order.message) {
    lines.push(`  ${order.message}`)
  }
  lines.push(``)
  lines.push(`💰 *Total: ₹${(order.totalAmount ?? 0).toFixed(2)}*`)
  if (order.notes) lines.push(`\n📝 ${order.notes}`)
  lines.push(`\n✅ Status: *${STATUS_META[order.status]?.label ?? order.status}*`)
  lines.push(`\nThank you for ordering from Sea Harvest Premium Seafoods! 🙏`)
  return encodeURIComponent(lines.join('\n'))
}

// ─── Main OrdersView ──────────────────────────────────────────────────────────
export function OrdersView({ showToast }: {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null)
  const [pdfLoading, setPdfLoading] = useState<string | null>(null)
  const [showNewOrder, setShowNewOrder] = useState(false)
  const secret = typeof window !== 'undefined' ? sessionStorage.getItem('admin_secret') ?? '' : ''
  const fetchOrders = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/orders?${params}`, {
        headers: { 'x-admin-secret': secret },
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : (data.orders ?? []))
    } catch { setError('Failed to load orders') }
    finally { setLoading(false) }
  }, [secret, statusFilter, search])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function handleStatusChange(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed')
      showToast('Status updated', 'success')
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        const updated = await res.json()
        setSelectedOrder(updated)
      }
    } catch { showToast('Failed to update status', 'error') }
  }

  async function handleDelete(order: Order) {
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      })
      if (!res.ok) throw new Error('Failed')
      showToast('Order deleted', 'success')
      setDeleteTarget(null)
      if (selectedOrder?.id === order.id) setSelectedOrder(null)
      fetchOrders()
    } catch { showToast('Failed to delete order', 'error') }
  }

  function handleDownloadPDF(order: Order) {
    setPdfLoading(order.id)
    try {
      downloadInvoice(toInvoiceData(order))
      showToast('Invoice downloaded', 'success')
    } catch { showToast('Failed to generate PDF', 'error') }
    finally { setTimeout(() => setPdfLoading(null), 1000) }
  }

  function handleWhatsApp(order: Order) {
    const phone = order.customerPhone.replace(/[^0-9]/g, '')
    const msg = buildWhatsAppMsg(order)
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length; return acc
  }, {} as Record<string, number>)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 max-w-7xl"
    >
      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            statusFilter === 'all'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All <span className="ml-1 opacity-70">{orders.length}</span>
        </button>
        {ALL_STATUSES.map(s => {
          const meta = STATUS_META[s]
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                statusFilter === s
                  ? `${meta.bg} ${meta.color}`
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {meta.label} <span className="ml-1 opacity-70">{counts[s] ?? 0}</span>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
          />
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl px-3 py-2.5 text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowNewOrder(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center px-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={fetchOrders} className="text-sm text-cyan-400 hover:text-cyan-300">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-base font-semibold text-slate-400">No orders yet</p>
            <p className="text-sm text-slate-600">Orders placed via the storefront will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/80">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Items</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map((order, i) => {
                  const meta = STATUS_META[order.status] ?? STATUS_META.PENDING
                  const StatusIcon = meta.icon
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-white text-sm">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-400">
                        {order.items.length > 0 ? `${order.items.length} item${order.items.length > 1 ? 's' : ''}` : '—'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-cyan-400 text-sm">
                        {order.totalAmount ? `₹${order.totalAmount.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${meta.bg} ${meta.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {/* WhatsApp share */}
                          <button
                            onClick={() => handleWhatsApp(order)}
                            title="Share via WhatsApp"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          {/* Download PDF */}
                          <button
                            onClick={() => handleDownloadPDF(order)}
                            title="Download PDF Invoice"
                            disabled={pdfLoading === order.id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all disabled:opacity-50"
                          >
                            {pdfLoading === order.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Download className="w-4 h-4" />}
                          </button>
                          {/* View details */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            title="View order"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(order)}
                            title="Delete order"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail panel */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
            onDownloadPDF={handleDownloadPDF}
            onWhatsApp={handleWhatsApp}
            pdfLoading={pdfLoading}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteOrderModal
            order={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget)}
          />
        )}
      </AnimatePresence>

      {/* New Order modal */}
      <AnimatePresence>
        {showNewOrder && (
          <NewOrderModal
            secret={secret}
            onClose={() => setShowNewOrder(false)}
            onSuccess={(order) => {
              setShowNewOrder(false)
              fetchOrders()
              showToast('Order created', 'success')
              setSelectedOrder(order)
            }}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
// ─── Order Detail Side Panel ──────────────────────────────────────────────────
function OrderDetailPanel({ order, onClose, onStatusChange, onDownloadPDF, onWhatsApp, pdfLoading }: {
  order: Order
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
  onDownloadPDF: (order: Order) => void
  onWhatsApp: (order: Order) => void
  pdfLoading: string | null
}) {
  const meta = STATUS_META[order.status] ?? STATUS_META.PENDING
  const StatusIcon = meta.icon
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-end bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <p className="text-xs text-slate-500 font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
            <h2 className="text-base font-bold text-white mt-0.5">{order.customerName}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Status badge + change */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border ${meta.bg} ${meta.color}`}>
              <StatusIcon className="w-4 h-4" />
              {meta.label}
            </span>
            <select
              value={order.status}
              onChange={e => onStatusChange(order.id, e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-cyan-500 cursor-pointer"
            >
              {ALL_STATUSES.map(s => (
                <option key={s} value={s} className="bg-slate-800">{STATUS_META[s].label}</option>
              ))}
            </select>
          </div>

          {/* Customer info */}
          <div className="bg-slate-800/50 rounded-2xl p-4 space-y-2.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Customer</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-sm font-semibold text-white">{order.customerName}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <a href={`tel:${order.customerPhone}`} className="text-sm text-emerald-400 hover:underline">{order.customerPhone}</a>
            </div>
            {order.customerEmail && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-violet-400" />
                </div>
                <a href={`mailto:${order.customerEmail}`} className="text-sm text-violet-400 hover:underline">{order.customerEmail}</a>
              </div>
            )}
          </div>

          {/* Items */}
          {order.items.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl overflow-hidden">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 pt-4 pb-2">Order Items</p>
              <div className="divide-y divide-slate-700/40">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.productName}</p>
                      <p className="text-xs text-slate-500">{item.quantity} {item.unit} × ₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold text-cyan-400">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/60 bg-slate-800/80">
                <p className="text-sm font-bold text-white">Total</p>
                <p className="text-base font-bold text-cyan-400">₹{(order.totalAmount ?? subtotal).toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Message / notes */}
          {order.message && (
            <div className="bg-slate-800/50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer Message</p>
              <p className="text-sm text-slate-300 leading-relaxed">{order.message}</p>
            </div>
          )}
          {order.notes && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Admin Notes</p>
              <p className="text-sm text-slate-300 leading-relaxed">{order.notes}</p>
            </div>
          )}

          <p className="text-xs text-slate-600 text-center">
            Placed {new Date(order.createdAt).toLocaleString('en-IN')} via {order.contactMethod}
          </p>
        </div>

        {/* Action buttons */}
        <div className="px-6 py-5 border-t border-slate-800 space-y-3">
          {/* WhatsApp share */}
          <button
            onClick={() => onWhatsApp(order)}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="w-5 h-5" />
            Share Invoice via WhatsApp
          </button>

          {/* Download PDF */}
          <button
            onClick={() => onDownloadPDF(order)}
            disabled={pdfLoading === order.id}
            className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {pdfLoading === order.id
              ? <><Loader2 className="w-5 h-5 animate-spin" />Generating PDF...</>
              : <><Download className="w-5 h-5" />Download PDF Invoice</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteOrderModal({ order, onClose, onConfirm }: {
  order: Order; onClose: () => void; onConfirm: () => void
}) {
  const [deleting, setDeleting] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Delete Order?</h3>
        <p className="text-sm text-slate-400 mb-5">Order from <span className="font-semibold text-white">{order.customerName}</span> will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors">Cancel</button>
          <button
            onClick={async () => { setDeleting(true); await onConfirm() }}
            disabled={deleting}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 disabled:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── New Order Modal ──────────────────────────────────────────────────────────
interface Product {
  id: string
  title: string
  price: number
  unit: string
  category: string
  imageUrl: string | null
  inStock: boolean
}

interface CartItem {
  productId: string
  productName: string
  price: number
  unit: string
  quantity: number
}

function NewOrderModal({ secret, onClose, onSuccess, showToast }: {
  secret: string
  onClose: () => void
  onSuccess: (order: Order) => void
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}) {
  // Customer fields
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [contactMethod, setContactMethod] = useState<'PHONE' | 'WHATSAPP' | 'EMAIL'>('WHATSAPP')
  const [message, setMessage] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<string>('CONFIRMED')

  // Product search + cart
  const [products, setProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load products on mount
  useEffect(() => {
    fetch('/api/products', { headers: { 'x-admin-secret': secret } })
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d : (d.products ?? [])))
      .catch(() => {})
  }, [secret])

  const filteredProducts = products.filter(p =>
    p.inStock &&
    (productSearch === '' ||
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()))
  )

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        return prev.map(i => i.productId === product.id
          ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, {
        productId: product.id,
        productName: product.title,
        price: product.price,
        unit: product.unit,
        quantity: 1,
      }]
    })
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId))
    } else {
      setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i))
    }
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(i => i.productId !== productId))
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  function validate() {
    const e: Record<string, string> = {}
    if (!customerName.trim()) e.customerName = 'Name is required'
    if (!customerPhone.trim()) e.customerPhone = 'Phone is required'
    if (customerPhone.trim().length < 7) e.customerPhone = 'Enter a valid phone number'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || null,
          contactMethod,
          message: message.trim() || null,
          items: cart,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        showToast(data?.error ?? 'Failed to create order', 'error')
        setSaving(false)
        return
      }
      const created = await res.json()

      // Update status + notes if not default
      if (status !== 'PENDING' || notes.trim()) {
        await fetch(`/api/orders/${created.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
          body: JSON.stringify({
            status,
            notes: notes.trim() || null,
          }),
        })
        created.status = status
        created.notes = notes.trim() || null
      }

      onSuccess(created)
    } catch {
      showToast('Something went wrong', 'error')
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-end bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full w-full max-w-xl bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">New Order</h2>
            <p className="text-xs text-slate-500 mt-0.5">Log a phone / walk-in order</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">

            {/* ── Customer ── */}
            <section>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Customer Details</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={customerName}
                    onChange={e => { setCustomerName(e.target.value); setErrors(p => ({ ...p, customerName: '' })) }}
                    placeholder="e.g. Rahul Menon"
                    className={`w-full bg-slate-800 border ${errors.customerName ? 'border-red-500' : 'border-slate-700'} focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors`}
                  />
                  {errors.customerName && <p className="text-xs text-red-400 mt-1">{errors.customerName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => { setCustomerPhone(e.target.value); setErrors(p => ({ ...p, customerPhone: '' })) }}
                      placeholder="+91 9XXXXXXXXX"
                      className={`w-full bg-slate-800 border ${errors.customerPhone ? 'border-red-500' : 'border-slate-700'} focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors`}
                    />
                    {errors.customerPhone && <p className="text-xs text-red-400 mt-1">{errors.customerPhone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="optional"
                      className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Contact Via</label>
                    <select
                      value={contactMethod}
                      onChange={e => setContactMethod(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="PHONE">Phone Call</option>
                      <option value="EMAIL">Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Order Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-slate-800">{STATUS_META[s].label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Product Search & Add ── */}
            <section>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Add Products</p>
              <div className="relative mb-3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Search products by name or category..."
                  className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
                />
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                {filteredProducts.length === 0 ? (
                  <p className="text-xs text-slate-600 text-center py-4">
                    {productSearch ? 'No matching products' : 'No products available'}
                  </p>
                ) : filteredProducts.map(p => {
                  const inCart = cart.find(i => i.productId === p.id)
                  return (
                    <div key={p.id} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 hover:border-slate-600 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{p.title}</p>
                        <p className="text-xs text-slate-500">{p.category} · <span className="text-cyan-400 font-semibold">₹{p.price}/{p.unit}</span></p>
                      </div>
                      {inCart ? (
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <button
                            type="button"
                            onClick={() => updateQty(p.id, inCart.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-white w-5 text-center">{inCart.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(p.id, inCart.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(p)}
                          className="ml-3 flex-shrink-0 flex items-center gap-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* ── Cart Summary ── */}
            {cart.length > 0 && (
              <section>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Order Summary <span className="text-cyan-400">({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                </p>
                <div className="bg-slate-800/50 rounded-2xl overflow-hidden">
                  <div className="divide-y divide-slate-700/40">
                    {cart.map(item => (
                      <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.productName}</p>
                          <p className="text-xs text-slate-500">₹{item.price} × {item.quantity} {item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p className="text-sm font-bold text-cyan-400 w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/60 bg-slate-800/80">
                    <p className="text-sm font-bold text-white">Total</p>
                    <p className="text-base font-bold text-cyan-400">₹{total.toFixed(2)}</p>
                  </div>
                </div>
              </section>
            )}

            {/* ── Notes ── */}
            <section>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Additional Info</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Customer Message / Special Request</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={2}
                    placeholder="Any special instructions from the customer..."
                    className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Admin Notes (internal)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Internal notes, delivery info, etc..."
                    className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sticky footer actions */}
          <div className="sticky bottom-0 px-6 py-4 bg-slate-900 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating...</>
              ) : (
                <><ShoppingCart className="w-4 h-4" />Create Order{cart.length > 0 ? ` · ₹${total.toFixed(2)}` : ''}</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
