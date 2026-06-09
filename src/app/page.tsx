'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Phone, Mail, Facebook, Instagram, ArrowLeft, Package, CheckCircle, Clock, MapPin, Fish, Truck, Star, X, PhoneCall, MessageCircle } from 'lucide-react'
import Image from 'next/image'

type Page = 'home' | 'buyfish'

interface OrderItem {
  id: number
  title: string
  category: string
  price: number
  image: string
  quantity: number
}

interface PurchasedOrder {
  id: string
  items: OrderItem[]
  totalPrice: number
  totalItems: number
  orderDate: string
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered'
  deliveryDate: string
  address: string
}

const products = [
  { id: 1, title: 'OCTOPUS SMALL', category: 'SHELLED FISH', price: 420, image: '/products/octopus.png' },
  { id: 2, title: 'SEA CRAB / KADAL NJAND - MEDIUM', category: 'SHELLED FISH', price: 380, image: '/products/crab.png' },
  { id: 3, title: 'SALMON FILLET', category: 'SEA WATER FISH', price: 890, image: '/products/salmon.png' },
  { id: 4, title: 'PRAWNS / CHEMMEEN - LARGE', category: 'SHELLED FISH', price: 550, image: '/products/prawns.png' },
  { id: 5, title: 'KING FISH / NEIMEEN', category: 'SEA WATER FISH', price: 720, image: '/products/kingfish.png' },
  { id: 6, title: 'MUSSELS / KALLUMMAKAYA', category: 'SHELLED FISH', price: 280, image: '/products/mussels.png' },
  { id: 7, title: 'SARDINES / MATHI', category: 'SEA WATER FISH', price: 180, image: '/products/sardines.png' },
  { id: 8, title: 'SQUID / KOONTHAL', category: 'SHELLED FISH', price: 460, image: '/products/squid.png' },
  { id: 9, title: 'TUNA / CHOORA', category: 'SEA WATER FISH', price: 590, image: '/products/tuna.png' },
  { id: 10, title: 'PEARL SPOT / KARIMEEN', category: 'BACKWATER FISH', price: 650, image: '/products/pearlspot.png' },
  { id: 11, title: 'POMFRET / AVOLI', category: 'SEA WATER FISH', price: 780, image: '/products/pomfret.png' },
  { id: 12, title: 'ROHU / ROHU', category: 'BACKWATER FISH', price: 320, image: '/products/rohu.png' },
]

const fishCategories = [
  'All Fish',
  'Seawater Fish',
  'Backwater Fish',
  'Freshwater Fish',
  'Shelled Fish',
  'Imported Fish',
  'Exotic Indian',
  'Ready To Cook',
  'Live Fish',
]

const categoryToFilter: Record<string, string> = {
  'All Fish': 'ALL',
  'Seawater Fish': 'SEA WATER FISH',
  'Backwater Fish': 'BACKWATER FISH',
  'Freshwater Fish': 'FRESHWATER FISH',
  'Shelled Fish': 'SHELLED FISH',
  'Imported Fish': 'IMPORTED FISH',
  'Exotic Indian': 'EXOTIC INDIAN',
  'Ready To Cook': 'READY TO COOK',
  'Live Fish': 'LIVE FISH',
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Clock }> = {
  Confirmed: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: CheckCircle },
  Processing: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  Shipped: { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Truck },
  Delivered: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
}

const COMPANY_PHONE = '+91 9539008444'

// Generate mock past orders for demo
function generateMockOrders(): PurchasedOrder[] {
  return [
    {
      id: 'OC-2024-0847',
      items: [
        { ...products[2], quantity: 2 },
        { ...products[4], quantity: 1 },
      ],
      totalPrice: 2500,
      totalItems: 3,
      orderDate: '2024-12-28',
      status: 'Delivered',
      deliveryDate: '2024-12-29',
      address: '42, Marine Drive, Kochi, Kerala 682031',
    },
    {
      id: 'OC-2024-0923',
      items: [
        { ...products[3], quantity: 1 },
        { ...products[7], quantity: 2 },
      ],
      totalPrice: 1470,
      totalItems: 3,
      orderDate: '2025-01-05',
      status: 'Shipped',
      deliveryDate: '2025-01-07',
      address: '15, MG Road, Thiruvananthapuram, Kerala 695001',
    },
    {
      id: 'OC-2025-0102',
      items: [
        { ...products[9], quantity: 1 },
        { ...products[0], quantity: 1 },
      ],
      totalPrice: 1070,
      totalItems: 2,
      orderDate: '2025-03-02',
      status: 'Processing',
      deliveryDate: '2025-03-04',
      address: '8, Church Street, Bengaluru, Karnataka 560001',
    },
  ]
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [purchasedOrders] = useState<PurchasedOrder[]>(generateMockOrders())
  const [callToast, setCallToast] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All Fish')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredProducts = selectedCategory === 'All Fish'
    ? products
    : products.filter((p) => p.category === categoryToFilter[selectedCategory])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // dropdown close logic if needed
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (callToast) {
      const timer = setTimeout(() => setCallToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [callToast])

  function handleCall(productTitle: string) {
    setCallToast(productTitle)
    // Initiate phone call
    const telLink = document.createElement('a')
    telLink.href = `tel:${COMPANY_PHONE.replace(/\s/g, '')}`
    telLink.click()
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}`, '_blank')
  }

  function navigateTo(page: Page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const breadcrumbTitle = currentPage === 'home' ? 'Buy Fish' : 'My Orders'
  const breadcrumbPath = currentPage === 'home' ? 'Buy Fish' : 'My Orders'

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        {/* Main Navigation Row */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 gap-4">
              {/* Logo */}
              <div className="flex-shrink-0 cursor-pointer" onClick={() => navigateTo('home')}>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-[#0891B2] tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                    OceanCatch
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 tracking-[0.2em] -mt-1">
                    DEFINITELY FRESH
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-xl mx-4 hidden sm:flex">
                <div className="flex w-full">
                  <input
                    type="text"
                    placeholder="Search product..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors"
                  />
                  <button className="bg-[#0891B2] hover:bg-[#0E7490] text-white px-5 py-2.5 rounded-r-lg transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* User Actions - Call & WhatsApp instead of Cart */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <a href="#" className="text-xs font-semibold text-gray-600 hover:text-[#0891B2] transition-colors tracking-wide hidden sm:block">
                  SIGNUP / LOGIN
                </a>
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 bg-[#0891B2] hover:bg-[#0E7490] text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span className="hidden sm:inline">Call to Order</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category Menu Row */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-6">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => navigateTo('buyfish')}
                    className="bg-[#0891B2] hover:bg-[#0E7490] text-white px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Fish className="w-4 h-4" />
                    Buy Fish
                  </button>
                </div>
                <nav className="flex items-center gap-6">
                  <button
                    onClick={() => navigateTo('home')}
                    className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors"
                  >
                    Buy Now
                  </button>
                  <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors flex items-center gap-1">
                    Salmon&apos;s Story
                    <ChevronDown className="w-3 h-3" />
                  </a>
                  <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors">
                    Reach Us
                  </a>
                </nav>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0891B2] transition-colors">
                  <Phone className="w-3 h-3" />
                  <span>{COMPANY_PHONE}</span>
                </a>
                <a href="#" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Mail className="w-3 h-3" />
                  <span>customercare@oceancatch.in</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Banner */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
            <h1 className="text-lg font-bold text-gray-800 mb-1">{breadcrumbTitle}</h1>
            <p className="text-sm text-gray-500">
              <button onClick={() => navigateTo('home')} className="hover:text-[#0891B2] transition-colors">
                Home
              </button>
              <span className="mx-2">/</span>
              <button onClick={() => navigateTo('buyfish')} className="hover:text-[#0891B2] transition-colors text-gray-700">
                {breadcrumbPath}
              </button>
            </p>
          </div>
        </div>
      </header>

      {/* ===== CALL TOAST NOTIFICATION ===== */}
      {callToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0891B2] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-medium">Calling for {callToast}</span>
            <p className="text-xs text-white/80 mt-0.5">Placing your order via call</p>
          </div>
          <button onClick={() => setCallToast(null)} className="ml-2 text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1">
        {currentPage === 'home' ? (
          /* ===== HOME PAGE - PRODUCT GRID ===== */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Category Filter Bar */}
            <div className="mb-8">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {fishCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-[#0891B2] text-white shadow-md shadow-[#0891B2]/20'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0891B2] hover:text-[#0891B2]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
                {selectedCategory !== 'All Fish' && (
                  <span> in <span className="font-semibold text-[#0891B2]">{selectedCategory}</span></span>
                )}
              </p>
              {/* Quick Call Banner */}
              <a
                href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#0891B2] hover:text-[#0E7490] transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Call to Order: {COMPANY_PHONE}
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-bold text-gray-900 tracking-wide mb-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium tracking-wider mb-2">
                      {product.category}
                    </p>
                    <p className="text-base font-bold text-[#0891B2]">
                      ₹ {product.price.toFixed(2)}/kg
                    </p>


                    {/* Call to Order Button */}
                    <button
                      onClick={() => handleCall(product.title)}
                      className="mt-3 w-full bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Call to Order
                    </button>

                    {/* WhatsApp Button */}
                    <button
                      onClick={handleWhatsApp}
                      className="mt-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Fish className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-600 mb-2">No fish found</h3>
                <p className="text-sm text-gray-400">Try selecting a different category</p>
              </div>
            )}
          </div>
        ) : (
          /* ===== MY ORDERS PAGE - PURCHASED ORDERS ===== */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0891B2] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>

            {/* Page Title */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#0891B2] rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
                <p className="text-sm text-gray-500">{purchasedOrders.length} order{purchasedOrders.length !== 1 ? 's' : ''} placed</p>
              </div>
            </div>

            {purchasedOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="w-24 h-24 mx-auto bg-[#CFFAFE] rounded-full flex items-center justify-center mb-6">
                  <Package className="w-12 h-12 text-[#0891B2] opacity-50" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  You haven&apos;t placed any orders yet. Call us to order your fresh catch!
                </p>
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call to Order
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {purchasedOrders.map((order) => {
                  const isExpanded = expandedOrder === order.id
                  const statusInfo = statusConfig[order.status]
                  const StatusIcon = statusInfo.icon

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Order Header */}
                      <div
                        className="px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg} border`}>
                              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-900">Order {order.id}</h3>
                                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.color}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#0891B2]">₹ {order.totalPrice.toFixed(2)}</p>
                              <p className="text-xs text-gray-400">{order.items.length} type{order.items.length !== 1 ? 's' : ''} · {order.totalItems} kg</p>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </div>

                        {/* Order Progress Bar */}
                        <div className="mt-4 flex items-center gap-1">
                          {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                            const isCompleted = ['Confirmed', 'Processing', 'Shipped', 'Delivered'].indexOf(order.status) >= i
                            const isCurrent = order.status === step
                            return (
                              <div key={step} className="flex-1 flex items-center gap-1">
                                <div className={`h-1.5 flex-1 rounded-full transition-all ${
                                  isCompleted ? 'bg-[#0891B2]' : 'bg-gray-200'
                                } ${isCurrent ? 'animate-pulse' : ''}`} />
                                {i < 3 && (
                                  <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                                    isCompleted ? 'bg-[#0891B2]' : 'bg-gray-200'
                                  }`} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="mt-1 flex justify-between">
                          <span className="text-[9px] text-gray-400">Confirmed</span>
                          <span className="text-[9px] text-gray-400">Processing</span>
                          <span className="text-[9px] text-gray-400">Shipped</span>
                          <span className="text-[9px] text-gray-400">Delivered</span>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-100">
                          {/* Order Items */}
                          <div className="divide-y divide-gray-50">
                            {order.items.map((item) => (
                              <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900 tracking-wide">{item.title}</h4>
                                  <p className="text-xs text-gray-400">{item.category} · {item.quantity} kg</p>
                                </div>
                                <p className="text-sm font-bold text-gray-800 flex-shrink-0">
                                  ₹ {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer */}
                          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start gap-4">
                                <div className="flex items-start gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                  <p className="text-xs text-gray-500 max-w-xs">{order.address}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {order.status !== 'Delivered' && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Truck className="w-3.5 h-3.5" />
                                    <span>ETA: {new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                  </div>
                                )}
                                <button className="text-xs font-semibold text-[#0891B2] hover:text-[#0E7490] transition-colors flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  Rate Order
                                </button>
                                <a
                                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                                  className="text-xs font-semibold text-[#25D366] hover:text-[#1DA851] transition-colors flex items-center gap-1"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  Reorder
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto">
        {/* Top Footer Tier */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Column 1: Logo */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex flex-col items-start cursor-pointer" onClick={() => navigateTo('home')}>
                  <span className="text-2xl font-bold text-[#0891B2] tracking-wide">
                    OceanCatch
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 tracking-[0.2em] -mt-1">
                    DEFINITELY FRESH
                  </span>
                </div>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  Premium quality seafood delivered fresh to your doorstep. Call us to place your order!
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Quick Links</h4>
                <ul className="space-y-2.5">
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Why OceanCatch?</a></li>
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">How OceanCatch?</a></li>
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Reach Us</a></li>
                </ul>
              </div>

              {/* Column 3: Policies */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Policies</h4>
                <ul className="space-y-2.5">
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Terms &amp; Conditions</a></li>
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Refund Policy</a></li>
                </ul>
              </div>

              {/* Column 4: Follow Us */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Follow Us On</h4>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-80 transition-opacity">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
                {/* Call to Order in Footer */}
                <div className="mt-4">
                  <a
                    href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call to Order
                  </a>
                </div>
              </div>

              {/* Column 5: Get The Mobile App */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Get The Mobile App</h4>
                <div className="space-y-2.5">
                  <a href="#" className="inline-block">
                    <div className="bg-black text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[8px] leading-tight">Download on the</div>
                        <div className="text-xs font-semibold leading-tight">App Store</div>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="inline-block">
                    <div className="bg-black text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3 20.5V3.5c0-.85.47-1.59 1.17-1.98l10.83 9.48-10.83 9.48c-.7-.39-1.17-1.13-1.17-1.98zm15.17-8.03l-2.76-1.6L5.67 3.47c.05-.01.1-.02.16-.02.33 0 .63.12.85.31l11.49 6.71zm0 3.06L6.68 22.24c-.22.19-.52.31-.85.31-.06 0-.11-.01-.16-.02l9.74-7.4 2.76-1.6zm1.83-1.07c.33.19.56.55.56.97s-.23.78-.56.97l-1.83 1.07-3.02-2.04 3.02-2.04 1.83 1.07z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[8px] leading-tight">GET IT ON</div>
                        <div className="text-xs font-semibold leading-tight">Google Play</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Tier */}
        <div className="bg-[#0891B2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/90">
                © OceanCatch, a unit of Hallmark Food Products LLP. Powered by Skywall
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/15">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[9px] font-semibold text-white">Positive SSL</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/15">
                  <span className="text-xs font-bold italic text-white tracking-tighter">VISA</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/15">
                  <div className="flex -space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#EB001B] opacity-80" />
                    <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-80" />
                  </div>
                  <span className="text-[9px] font-semibold text-white">Mastercard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
