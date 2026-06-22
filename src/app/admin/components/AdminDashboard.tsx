'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutDashboard, Package, LogOut, Fish, Plus, Pencil, Trash2,
  X, Check, Upload, Loader2, Eye, EyeOff, RefreshCw, TrendingUp,
  ShoppingBag, AlertCircle, Search, ChevronDown, Menu, ExternalLink,
  Waves, Star, BarChart3, Settings, Bell, ChevronRight,
  ArrowUpRight, ArrowDownRight, Filter, MoreHorizontal
} from 'lucide-react'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Product {
  id: string
  title: string
  description: string | null
  category: string
  price: number
  unit: string
  imageUrl: string | null
  imageId: string | null
  inStock: boolean
  createdAt: string
}

const CATEGORIES = [
  'Sea Water Fish', 'Backwater Fish', 'Freshwater Fish',
  'Shelled Fish', 'Imported Fish', 'Exotic Indian',
  'Ready To Cook', 'Live Fish',
]

const CATEGORY_COLORS: Record<string, string> = {
  'Sea Water Fish': '#06b6d4',
  'Backwater Fish': '#0891b2',
  'Freshwater Fish': '#0e7490',
  'Shelled Fish': '#155e75',
  'Imported Fish': '#8b5cf6',
  'Exotic Indian': '#f59e0b',
  'Ready To Cook': '#10b981',
  'Live Fish': '#f97316',
}

const EMPTY_FORM = {
  title: '', description: '', category: 'Sea Water Fish',
  price: '', unit: 'kg', inStock: true, imageUrl: '', imageId: '',
}

type NavItem = 'dashboard' | 'products'

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [])

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'outofstock'>('all')
  const secret = typeof window !== 'undefined' ? sessionStorage.getItem('admin_secret') ?? '' : ''

  function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function fetchProducts() {
    setLoading(true); setError('')
    try {
      const s = sessionStorage.getItem('admin_secret') ?? ''
      const res = await fetch('/api/products', {
        headers: { 'x-admin-secret': s },
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      // API returns { products: [], total, page, ... } — extract the array
      setProducts(Array.isArray(data) ? data : (data.products ?? []))
    } catch { setError('Failed to load products') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    const matchStock = stockFilter === 'all' || (stockFilter === 'instock' ? p.inStock : !p.inStock)
    return matchSearch && matchCat && matchStock
  })

  const inStock = products.filter(p => p.inStock).length
  const outOfStock = products.filter(p => !p.inStock).length
  const avgPrice = products.length ? products.reduce((s, p) => s + p.price, 0) / products.length : 0

  const categoryData = CATEGORIES.map(cat => ({
    name: cat.split(' ')[0],
    full: cat,
    count: products.filter(p => p.category === cat).length,
    color: CATEGORY_COLORS[cat],
  })).filter(c => c.count > 0)

  const pieData = [
    { name: 'In Stock', value: inStock, color: '#10b981' },
    { name: 'Out of Stock', value: outOfStock, color: '#ef4444' },
  ].filter(d => d.value > 0)

  return (
    <div className="min-h-screen bg-slate-950 flex text-white">
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onLogout={onLogout}
        productsCount={products.length}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Top bar */}
        <AdminTopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeNav={activeNav}
        />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {activeNav === 'dashboard' && (
              <DashboardView
                key="dashboard"
                products={products}
                loading={loading}
                inStock={inStock}
                outOfStock={outOfStock}
                avgPrice={avgPrice}
                categoryData={categoryData}
                pieData={pieData}
                onNavigateToProducts={() => setActiveNav('products')}
              />
            )}
            {activeNav === 'products' && (
              <ProductsView
                key="products"
                products={filteredProducts}
                allProducts={products}
                loading={loading}
                error={error}
                secret={secret}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                stockFilter={stockFilter}
                setStockFilter={setStockFilter}
                onRefresh={fetchProducts}
                showToast={showToast}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium backdrop-blur-xl border
              ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' :
                toast.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-300' :
                'bg-cyan-950/90 border-cyan-500/30 text-cyan-300'}`}
          >
            {toast.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> :
             toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> :
             <Bell className="w-4 h-4 text-cyan-400" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function AdminSidebar({ open, activeNav, onNavChange, onLogout, productsCount, onToggleSidebar }: {
  open: boolean; activeNav: NavItem; onNavChange: (n: NavItem) => void;
  onLogout: () => void; productsCount: number; onToggleSidebar: () => void
}) {
  const navItems = [
    { id: 'dashboard' as NavItem, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products' as NavItem, icon: Package, label: 'Products', badge: productsCount },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside className={`flex flex-col fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800/60 z-40 transition-all duration-300 ${open ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-16'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60 overflow-hidden">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
            <Fish className="w-5 h-5 text-white" />
          </div>
          {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm font-bold text-white">Sea Harvest Premium Seafoods</p>
              <p className="text-[10px] text-cyan-400 font-medium tracking-wider">ADMIN</p>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavChange(item.id)
                if (typeof window !== 'undefined' && window.innerWidth < 1024 && open) onToggleSidebar()
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                ${activeNav === item.id
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '18px', height: '18px' }} />
              {open && <span>{item.label}</span>}
              {open && item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {activeNav === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-400 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-slate-800/60">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all w-full"
          >
            <ExternalLink style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
            {open && <span>View Site</span>}
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
            {open && <span>Logout</span>}
          </button>
          {open && (
            <div className="mt-3 mx-1 p-3 bg-slate-800/60 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">A</div>
                <div>
                  <p className="text-xs font-semibold text-white">admin</p>
                  <p className="text-[10px] text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-30" onClick={onToggleSidebar} />
      )}
    </>
  )
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
function AdminTopBar({ sidebarOpen, onToggleSidebar, activeNav }: {
  sidebarOpen: boolean; onToggleSidebar: () => void; activeNav: NavItem
}) {
  const titles: Record<NavItem, string> = {
    dashboard: 'Dashboard',
    products: 'Product Management',
  }
  const subtitles: Record<NavItem, string> = {
    dashboard: 'Overview of your store performance',
    products: 'Manage your seafood catalog',
  }
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/60">
      <div className="flex items-center gap-4 px-4 sm:px-6 py-4">
        <button
          onClick={onToggleSidebar}
          className="flex w-8 h-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-white">{titles[activeNav]}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitles[activeNav]}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium hidden sm:block">Live</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">A</div>
        </div>
      </div>
    </header>
  )
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView({ products, loading, inStock, outOfStock, avgPrice, categoryData, pieData, onNavigateToProducts }: {
  products: Product[]; loading: boolean; inStock: number; outOfStock: number;
  avgPrice: number; categoryData: any[]; pieData: any[]; onNavigateToProducts: () => void
}) {
  const recentProducts = [...products].slice(0, 5)

  const stats = [
    {
      label: 'Total Products', value: products.length, icon: Package,
      color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-500/10', text: 'text-cyan-400',
      change: '+12%', up: true, sub: 'In catalog'
    },
    {
      label: 'In Stock', value: inStock, icon: Check,
      color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500/10', text: 'text-emerald-400',
      change: products.length ? Math.round((inStock / products.length) * 100) + '%' : '0%', up: true, sub: 'Available'
    },
    {
      label: 'Out of Stock', value: outOfStock, icon: AlertCircle,
      color: 'from-red-500 to-red-600', bg: 'bg-red-500/10', text: 'text-red-400',
      change: products.length ? Math.round((outOfStock / products.length) * 100) + '%' : '0%', up: false, sub: 'Needs restock'
    },
    {
      label: 'Avg. Price', value: `₹${avgPrice.toFixed(0)}`, icon: TrendingUp,
      color: 'from-violet-500 to-violet-600', bg: 'bg-violet-500/10', text: 'text-violet-400',
      change: 'per unit', up: true, sub: 'Across catalog'
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl"
    >
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.text}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${stat.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{loading ? '—' : stat.value}</p>
            <p className="text-sm font-medium text-slate-300 mt-0.5">{stat.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-slate-900 border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Products by Category</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution across all categories</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={categoryData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  itemStyle={{ color: '#06b6d4' }}
                  formatter={(v: any, _: any, p: any) => [v, p.payload.full]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Stock Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">Availability overview</p>
            </div>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Recent products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Products</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest additions to your catalog</p>
          </div>
          <button onClick={onNavigateToProducts} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-slate-800/40">
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="py-8 text-center text-slate-600 text-sm">No products yet</div>
          ) : recentProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/30 transition-colors"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Fish className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                <p className="text-xs text-slate-500">{p.category}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-cyan-400">₹{p.price}/{p.unit}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${p.inStock ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Products View ────────────────────────────────────────────────────────────
function ProductsView({ products, allProducts, loading, error, secret, searchQuery, setSearchQuery,
  categoryFilter, setCategoryFilter, stockFilter, setStockFilter, onRefresh, showToast }: {
  products: Product[]; allProducts: Product[]; loading: boolean; error: string; secret: string;
  searchQuery: string; setSearchQuery: (v: string) => void;
  categoryFilter: string; setCategoryFilter: (v: string) => void;
  stockFilter: 'all' | 'instock' | 'outofstock'; setStockFilter: (v: 'all' | 'instock' | 'outofstock') => void;
  onRefresh: () => void; showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  function openAdd() { setEditTarget(null); setShowForm(true) }
  function openEdit(p: Product) { setEditTarget(p); setShowForm(true) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 max-w-7xl"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
          />
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="all">All Stock</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl px-3 py-2.5 text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-300">{products.length}</span> of <span className="font-semibold text-slate-300">{allProducts.length}</span> products
        </p>
        {(searchQuery || categoryFilter !== 'All' || stockFilter !== 'all') && (
          <button
            onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setStockFilter('all') }}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center px-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={onRefresh} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center px-4">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
              <Fish className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-base font-semibold text-slate-400">No products found</p>
            <p className="text-sm text-slate-600">
              {searchQuery || categoryFilter !== 'All' ? 'Try adjusting your filters' : 'Add your first product to get started'}
            </p>
            {!searchQuery && categoryFilter === 'All' && (
              <button onClick={openAdd} className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
                Add first product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/80">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {products.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                          {p.imageUrl ? (
                            <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="44px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Fish className="w-5 h-5 text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm truncate max-w-[180px]">{p.title}</p>
                          {p.description && <p className="text-xs text-slate-500 truncate max-w-[180px]">{p.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-cyan-400">₹{p.price.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">per {p.unit}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${p.inStock ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${p.id}`} target="_blank"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <ProductFormModal
            editTarget={editTarget}
            secret={secret}
            onClose={() => setShowForm(false)}
            onSuccess={() => { setShowForm(false); onRefresh(); showToast(editTarget ? 'Product updated' : 'Product added') }}
            showToast={showToast}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            product={deleteTarget}
            secret={secret}
            onClose={() => setDeleteTarget(null)}
            onSuccess={() => { setDeleteTarget(null); onRefresh(); showToast('Product deleted') }}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Product Form Modal ───────────────────────────────────────────────────────
function ProductFormModal({ editTarget, secret, onClose, onSuccess, showToast }: {
  editTarget: Product | null; secret: string;
  onClose: () => void; onSuccess: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}) {
  const [form, setForm] = useState(editTarget ? {
    title: editTarget.title, description: editTarget.description ?? '',
    category: editTarget.category, price: editTarget.price.toString(),
    unit: editTarget.unit, inStock: editTarget.inStock,
    imageUrl: editTarget.imageUrl ?? '', imageId: editTarget.imageId ?? '',
  } : { ...EMPTY_FORM })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(editTarget?.imageUrl ?? null)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB', 'error'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.category || !form.price) {
      showToast('Title, category and price are required', 'error'); return
    }
    setSaving(true)
    try {
      let imageUrl = form.imageUrl
      let imageId = form.imageId
      if (imageFile) {
        setUploadProgress(30)
        const result = await uploadToCloudinary(imageFile, secret)
        imageUrl = result.url; imageId = result.publicId
        setUploadProgress(80)
      }
      const payload = { ...form, price: parseFloat(form.price), imageUrl, imageId }
      const url = editTarget ? `/api/products/${editTarget.id}` : '/api/products'
      const method = editTarget ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        showToast(res.status === 401 ? 'Unauthorized' : (data?.error ?? 'Save failed'), 'error')
        return
      }
      setUploadProgress(100)
      onSuccess()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong', 'error')
    } finally {
      setSaving(false); setUploadProgress(0)
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
        className="h-full w-full max-w-lg bg-slate-900 border-l border-slate-800 overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="text-base font-bold text-white">{editTarget ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{editTarget ? 'Update product details' : 'Fill in the details below'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-5">
          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Product Image</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl overflow-hidden cursor-pointer transition-colors group"
              style={{ aspectRatio: '16/9' }}
            >
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="480px" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                      <Upload className="w-4 h-4" /> Change Image
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs text-slate-600 mt-0.5">JPEG, PNG, WebP · max 5MB</p>
                  </div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. King Fish / Neimeen"
              className="w-full bg-slate-800/60 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Fresh catch from Kerala coast..."
              className="w-full bg-slate-800/60 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none"
            />
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-800/60 border border-slate-700 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Unit</label>
              <select
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                className="w-full bg-slate-800/60 border border-slate-700 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors cursor-pointer"
              >
                {['kg', 'piece', 'dozen', 'g'].map(u => <option key={u} value={u} className="bg-slate-800">{u}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Price (₹) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">₹</span>
                <input
                  type="number" min="0" step="0.01"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-slate-800/60 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 pl-8 text-sm outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Availability</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, inStock: !form.inStock })}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  form.inStock
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <span>{form.inStock ? 'In Stock' : 'Out of Stock'}</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${form.inStock ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                  <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${form.inStock ? 'left-4.5' : 'left-0.5'}`} style={{ left: form.inStock ? '18px' : '2px' }} />
                </div>
              </button>
            </div>
          </div>

          {/* Upload progress */}
          {saving && uploadProgress > 0 && (
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{uploadProgress < 80 ? 'Uploading image...' : uploadProgress < 100 ? 'Saving...' : 'Done'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              ) : (
                <><Check className="w-4 h-4" />{editTarget ? 'Save Changes' : 'Add Product'}</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ product, secret, onClose, onSuccess, showToast }: {
  product: Product; secret: string;
  onClose: () => void; onSuccess: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        showToast(res.status === 401 ? 'Unauthorized' : (data?.error ?? 'Delete failed'), 'error')
        return
      }
      onSuccess()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden"
      >
        {/* Red top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />

        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4"
          >
            <Trash2 className="w-8 h-8 text-red-400" />
          </motion.div>

          <h3 className="text-lg font-bold text-white mb-1">Delete Product?</h3>
          <p className="text-sm text-slate-400 mb-2">
            This will permanently remove
          </p>
          <p className="text-sm font-semibold text-white bg-slate-800 px-3 py-1.5 rounded-lg mb-5">
            {product.title}
          </p>
          <p className="text-xs text-slate-600 mb-6">This action cannot be undone.</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-400 disabled:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {deleting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</>
              ) : (
                <><Trash2 className="w-4 h-4" />Delete</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
