'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Phone, Mail, Facebook, Instagram, ArrowLeft, Clock, MapPin, Fish, Truck, X, PhoneCall, MessageCircle, Info, Scale, Droplets, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

type Page = 'home' | 'story' | 'contact'

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

const COMPANY_PHONE = '+91 9539008444'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [callToast, setCallToast] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All Fish')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [isStoryDropdownOpen, setIsStoryDropdownOpen] = useState(false)
  const storyDropdownRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const filteredProducts = selectedCategory === 'All Fish'
    ? products
    : products.filter((p) => p.category === categoryToFilter[selectedCategory])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (storyDropdownRef.current && !storyDropdownRef.current.contains(event.target as Node)) {
        setIsStoryDropdownOpen(false)
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

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedProduct(null)
    }
    function handleOverlayClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSelectedProduct(null)
      }
    }
    if (selectedProduct) {
      document.addEventListener('keydown', handleEsc)
      document.addEventListener('mousedown', handleOverlayClick)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('mousedown', handleOverlayClick)
      document.body.style.overflow = ''
    }
  }, [selectedProduct])

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

  const breadcrumbTitle = currentPage === 'home' ? 'Buy Fish' : currentPage === 'story' ? 'Why OceanCatch' : 'Reach Us'
  const breadcrumbPath = currentPage === 'home' ? 'Buy Fish' : currentPage === 'story' ? 'Why OceanCatch' : 'Reach Us'

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
                <button
                  onClick={() => navigateTo('home')}
                  className="bg-[#0891B2] hover:bg-[#0E7490] text-white px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Fish className="w-4 h-4" />
                  Buy Fish
                </button>
                <nav className="flex items-center gap-6">
                  <button
                    onClick={() => navigateTo('home')}
                    className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors"
                  >
                    Buy Now
                  </button>
                  <div className="relative" ref={storyDropdownRef}>
                    <button
                      onClick={() => setIsStoryDropdownOpen(!isStoryDropdownOpen)}
                      className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors flex items-center gap-1"
                    >
                      OceanCatch Story
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isStoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStoryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-b-md shadow-lg border-t-2 border-[#0891B2] z-50 py-1">
                        <button
                          onClick={() => { navigateTo('story'); setIsStoryDropdownOpen(false) }}
                          className="block w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-[#CFFAFE] hover:text-[#0891B2] transition-colors"
                        >
                          Why OceanCatch?
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => navigateTo('contact')}
                    className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors"
                  >
                    Reach Us
                  </button>
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
              <button onClick={() => navigateTo(currentPage)} className="hover:text-[#0891B2] transition-colors text-gray-700">
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

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          >
            {/* Modal Header with close */}
            <div className="relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="relative w-full md:w-1/2 aspect-square bg-gray-50">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    fill
                    className="object-cover md:rounded-l-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                  {/* Category Badge */}
                  <span className="inline-flex items-center gap-1.5 self-start text-xs font-semibold px-3 py-1 rounded-full bg-[#CFFAFE] text-[#0891B2] mb-3">
                    <Fish className="w-3 h-3" />
                    {selectedProduct.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 tracking-wide mb-2">
                    {selectedProduct.title}
                  </h2>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-[#0891B2]">
                      ₹ {selectedProduct.price.toFixed(2)}
                      <span className="text-sm font-normal text-gray-500">/kg</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    Fresh {selectedProduct.title.toLowerCase()} sourced directly from the coast. 
                    Hand-picked and quality-checked to ensure you get the freshest catch delivered to your doorstep. 
                    Perfect for grilling, frying, or currying.
                  </p>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Scale className="w-4 h-4 text-[#0891B2]" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Min. Order</p>
                        <p className="text-[11px] text-gray-500">1 kg</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Droplets className="w-4 h-4 text-[#0891B2]" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Freshness</p>
                        <p className="text-[11px] text-gray-500">100% Fresh</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-[#0891B2]" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Quality</p>
                        <p className="text-[11px] text-gray-500">Premium Grade</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Truck className="w-4 h-4 text-[#0891B2]" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Delivery</p>
                        <p className="text-[11px] text-gray-500">Same Day</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto space-y-3">
                    <button
                      onClick={() => handleCall(selectedProduct.title)}
                      className="w-full bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-5 h-5" />
                      Call to Order
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Order via WhatsApp
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                      Call or WhatsApp us at <span className="font-semibold text-gray-600">{COMPANY_PHONE}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1">
        {currentPage === 'contact' ? (
          /* ===== REACH US / CONTACT PAGE ===== */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0891B2] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-[#0891B2] to-[#065F73] rounded-2xl overflow-hidden mb-12">
              <div className="px-8 md:px-16 py-16 md:py-20 relative z-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white/90 mb-4">
                  <Phone className="w-3 h-3" />
                  Get In Touch
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Reach Us
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
                  Have a question, want to place an order, or just want to say hello? We&apos;re always here to help. Reach out to us through any of the channels below.
                </p>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Phone */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-[#0891B2] rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Call Us</h3>
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="text-sm text-[#0891B2] font-semibold hover:underline">
                  {COMPANY_PHONE}
                </a>
                <p className="text-xs text-gray-400 mt-2">Mon-Sat, 7AM - 9PM</p>
              </div>

              {/* WhatsApp */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-[#25D366] rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">WhatsApp</h3>
                <button onClick={handleWhatsApp} className="text-sm text-[#25D366] font-semibold hover:underline">
                  Chat with us
                </button>
                <p className="text-xs text-gray-400 mt-2">Quick response guaranteed</p>
              </div>

              {/* Email */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-[#0891B2] rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Email Us</h3>
                <a href="mailto:customercare@oceancatch.in" className="text-sm text-[#0891B2] font-semibold hover:underline">
                  customercare@oceancatch.in
                </a>
                <p className="text-xs text-gray-400 mt-2">We reply within 24 hours</p>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-[#0891B2] rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Visit Us</h3>
                <p className="text-sm text-[#0891B2] font-semibold">
                  Kochi, Kerala
                </p>
                <p className="text-xs text-gray-400 mt-2">By appointment only</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center">
                    <span className="text-lg">✉️</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Send Us a Message</h2>
                    <p className="text-sm text-gray-500">We&apos;ll get back to you shortly</p>
                  </div>
                </div>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject</label>
                    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors text-gray-600">
                      <option>Place an Order</option>
                      <option>Order Inquiry</option>
                      <option>Feedback</option>
                      <option>Complaint</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold py-3 rounded-lg transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Location & Info */}
              <div className="space-y-6">
                {/* Map Placeholder */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] h-56 flex items-center justify-center relative">
                    <div className="text-center">
                      <MapPin className="w-10 h-10 text-[#0891B2] mx-auto mb-2" />
                      <p className="text-sm font-semibold text-[#0891B2]">OceanCatch HQ</p>
                      <p className="text-xs text-gray-600">42, Marine Drive, Kochi, Kerala 682031</p>
                    </div>
                    {/* Decorative wave */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <svg viewBox="0 0 1440 60" fill="none" className="w-full">
                        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#0891B2]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Business Hours</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { day: 'Monday - Saturday', hours: '7:00 AM - 9:00 PM', active: true },
                      { day: 'Sunday', hours: '8:00 AM - 2:00 PM', active: true },
                      { day: 'Public Holidays', hours: 'Closed', active: false },
                    ].map((schedule) => (
                      <div key={schedule.day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-700 font-medium">{schedule.day}</span>
                        <span className={`text-sm font-semibold ${schedule.active ? 'text-[#0891B2]' : 'text-gray-400'}`}>{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center">
                      <span className="text-lg">🌐</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Follow Us</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-80 transition-opacity">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-80 transition-opacity">
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="bg-gradient-to-r from-[#0891B2] to-[#065F73] rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Prefer to talk directly?
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                The fastest way to place an order or get help is to call us directly. Our team is standing by!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 bg-white text-[#0891B2] text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call Now
                </a>
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1DA851] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </button>
              </div>
            </div>
          </div>
        ) : currentPage === 'story' ? (
          /* ===== WHY OCEANCATCH PAGE ===== */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0891B2] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-[#0891B2] to-[#065F73] rounded-2xl overflow-hidden mb-12">
              <div className="px-8 md:px-16 py-16 md:py-20 relative z-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white/90 mb-4">
                  <Fish className="w-3 h-3" />
                  Our Story
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Why OceanCatch?
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
                  We believe everyone deserves access to the freshest seafood. That&apos;s why we go straight from the ocean to your doorstep — no middlemen, no delays, no compromises.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="white">
                  <path d="M100 20c-20 0-35 15-35 35 0 15 10 28 23 33l-5 32h34l-5-32c13-5 23-18 23-33 0-20-15-35-35-35zm-8 85h16l3-18c-3 1-7 2-11 2s-8-1-11-2l3 18zm8-50c-8 0-15-7-15-15s7-15 15-15 15 7 15 15-7 15-15 15z"/>
                </svg>
              </div>
            </div>

            {/* Our Beginning Section */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center">
                  <span className="text-lg">🌊</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Beginning</h2>
                  <p className="text-sm text-gray-500">Where it all started</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      OceanCatch was born from a simple observation: the seafood on our plates often traveled through too many hands before reaching us. By the time it arrived, freshness was compromised and prices were inflated.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Founded in 2020 in Kochi, Kerala — the heart of India&apos;s fishing coast — we set out to change that. We built direct relationships with local fishermen and created a supply chain that gets fish from the boat to your door in hours, not days.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      What started as a small operation serving Kochi has now grown into a trusted seafood brand delivering across Kerala, Karnataka, and Tamil Nadu — always with the same promise: <span className="font-semibold text-[#0891B2]">Definitely Fresh.</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#CFFAFE] rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-[#0891B2]">2020</p>
                      <p className="text-xs text-gray-600 mt-1">Founded</p>
                    </div>
                    <div className="bg-[#CFFAFE] rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-[#0891B2]">500+</p>
                      <p className="text-xs text-gray-600 mt-1">Fishermen Partners</p>
                    </div>
                    <div className="bg-[#CFFAFE] rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-[#0891B2]">50K+</p>
                      <p className="text-xs text-gray-600 mt-1">Happy Customers</p>
                    </div>
                    <div className="bg-[#CFFAFE] rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-[#0891B2]">3</p>
                      <p className="text-xs text-gray-600 mt-1">States Served</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Features Section */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center">
                  <span className="text-lg">⭐</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Features</h2>
                  <p className="text-sm text-gray-500">What makes us different</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: '🐟', title: 'Farm-Fresh Seafood', desc: 'Sourced directly from the ocean. No frozen stock, no cold storage — only fresh catch delivered the same day it lands on the boat.' },
                  { icon: '⚡', title: 'Same Day Delivery', desc: 'Order before 10 AM and get your seafood delivered the same day. Our cold-chain logistics ensures everything stays fresh en route.' },
                  { icon: '🔍', title: 'Quality Checked', desc: 'Every fish is hand-inspected by our quality team. We check for freshness, size, and quality before it reaches you.' },
                  { icon: '💰', title: 'Fair Pricing', desc: 'By cutting out middlemen, we offer premium seafood at honest prices. You pay for the fish, not the supply chain.' },
                  { icon: '📦', title: 'Hygienic Packing', desc: 'Vacuum-sealed and packed in food-grade materials. Our packaging preserves freshness and prevents contamination.' },
                  { icon: '🤝', title: 'Fishermen First', desc: 'We pay our fishermen partners fairly and directly. Every purchase supports local coastal communities and sustainable fishing.' },
                ].map((feature) => (
                  <div key={feature.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="w-12 h-12 bg-[#CFFAFE] rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Promise Section */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center">
                  <span className="text-lg">🤝</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Promise</h2>
                  <p className="text-sm text-gray-500">What we guarantee</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: ShieldCheck, title: '100% Fresh', desc: 'Or your money back' },
                    { icon: Truck, title: 'On-Time Delivery', desc: 'Guaranteed delivery slot' },
                    { icon: Scale, title: 'Right Weight', desc: 'What you order is what you get' },
                    { icon: PhoneCall, title: '24/7 Support', desc: 'Call us anytime for help' },
                  ].map((promise) => (
                    <div key={promise.title} className="text-center p-4">
                      <div className="w-14 h-14 mx-auto bg-[#0891B2] rounded-full flex items-center justify-center mb-3">
                        <promise.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{promise.title}</h4>
                      <p className="text-xs text-gray-500">{promise.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#0891B2] to-[#065F73] rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to taste the difference?
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                Call us now to place your order and experience the freshest seafood you&apos;ve ever had.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 bg-white text-[#0891B2] text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call to Order
                </a>
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1DA851] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </button>
              </div>
            </div>
          </div>
        ) : (
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
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col cursor-pointer group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 text-center flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-gray-900 tracking-wide mb-1 min-h-[2.5rem]">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium tracking-wider mb-2">
                      {product.category}
                    </p>
                    <p className="text-base font-bold text-[#0891B2]">
                      ₹ {product.price.toFixed(2)}/kg
                    </p>
                    <div className="mt-auto pt-3">
                      {/* Call to Order Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCall(product.title) }}
                        className="mt-3 w-full bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <PhoneCall className="w-4 h-4" />
                        Call to Order
                      </button>

                      {/* WhatsApp Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleWhatsApp() }}
                        className="mt-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </button>
                    </div>
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
                  <li><button onClick={() => navigateTo('story')} className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Why OceanCatch?</button></li>
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">How OceanCatch?</a></li>
                  <li><button onClick={() => navigateTo('contact')} className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Reach Us</button></li>
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
