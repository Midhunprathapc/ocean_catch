'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ShoppingCart, ChevronDown, Phone, Mail, Facebook, Instagram } from 'lucide-react'
import Image from 'next/image'

const products = [
  {
    id: 1,
    title: 'OCTOPUS SMALL',
    category: 'SHELLED FISH',
    price: 420,
    originalPrice: 520,
    image: '/products/octopus.png',
  },
  {
    id: 2,
    title: 'SEA CRAB / KADAL NJAND - MEDIUM',
    category: 'SHELLED FISH',
    price: 380,
    originalPrice: null,
    image: '/products/crab.png',
  },
  {
    id: 3,
    title: 'SALMON FILLET',
    category: 'SEA WATER FISH',
    price: 890,
    originalPrice: 1050,
    image: '/products/salmon.png',
  },
  {
    id: 4,
    title: 'PRAWNS / CHEMMEEN - LARGE',
    category: 'SHELLED FISH',
    price: 550,
    originalPrice: null,
    image: '/products/prawns.png',
  },
  {
    id: 5,
    title: 'KING FISH / NEIMEEN',
    category: 'SEA WATER FISH',
    price: 720,
    originalPrice: 850,
    image: '/products/kingfish.png',
  },
  {
    id: 6,
    title: 'MUSSELS / KALLUMMAKAYA',
    category: 'SHELLED FISH',
    price: 280,
    originalPrice: null,
    image: '/products/mussels.png',
  },
  {
    id: 7,
    title: 'SARDINES / MATHI',
    category: 'SEA WATER FISH',
    price: 180,
    originalPrice: null,
    image: '/products/sardines.png',
  },
  {
    id: 8,
    title: 'SQUID / KOONTHAL',
    category: 'SHELLED FISH',
    price: 460,
    originalPrice: 550,
    image: '/products/squid.png',
  },
  {
    id: 9,
    title: 'TUNA / CHOORA',
    category: 'SEA WATER FISH',
    price: 590,
    originalPrice: null,
    image: '/products/tuna.png',
  },
  {
    id: 10,
    title: 'PEARL SPOT / KARIMEEN',
    category: 'BACKWATER FISH',
    price: 650,
    originalPrice: 780,
    image: '/products/pearlspot.png',
  },
  {
    id: 11,
    title: 'POMFRET / AVOLI',
    category: 'SEA WATER FISH',
    price: 780,
    originalPrice: null,
    image: '/products/pomfret.png',
  },
  {
    id: 12,
    title: 'ROHU / ROHU',
    category: 'BACKWATER FISH',
    price: 320,
    originalPrice: null,
    image: '/products/rohu.png',
  },
]

const fishCategories = [
  'Seawater Fish',
  'Backwater Fish',
  'Freshwater Fish',
  'Shelled Fish',
  'Imported Fish',
  'Exotic Indian',
  'Ready To Cook',
  'Live Fish',
]

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-sm">
        {/* Main Navigation Row */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="#" className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-[#E55B5B] tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                    salmons
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 tracking-[0.2em] -mt-1">
                    DEFINITELY FRESH
                  </span>
                </a>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-xl mx-4 hidden sm:flex">
                <div className="flex w-full">
                  <input
                    type="text"
                    placeholder="Search product..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-[#E55B5B] transition-colors"
                  />
                  <button className="bg-[#E55B5B] hover:bg-[#D04A4A] text-white px-5 py-2.5 rounded-r-lg transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* User Actions */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <a href="#" className="text-xs font-semibold text-gray-600 hover:text-[#E55B5B] transition-colors tracking-wide">
                  SIGNUP / LOGIN
                </a>
                <a href="#" className="relative text-gray-600 hover:text-[#E55B5B] transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-[#E55B5B] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    0
                  </span>
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
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-[#E55B5B] hover:bg-[#D04A4A] text-white px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    Buy Fish
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-0 w-52 bg-white rounded-b-md shadow-lg border-t-2 border-[#E55B5B] z-50 py-1">
                      {fishCategories.map((category) => (
                        <a
                          key={category}
                          href="#"
                          className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-[#FDE8E8] hover:text-[#E55B5B] transition-colors"
                        >
                          {category}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <nav className="flex items-center gap-6">
                  <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#E55B5B] transition-colors">
                    Buy Now
                  </a>
                  <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#E55B5B] transition-colors flex items-center gap-1">
                    Salmon&apos;s Story
                    <ChevronDown className="w-3 h-3" />
                  </a>
                  <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#E55B5B] transition-colors">
                    Reach Us
                  </a>
                </nav>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <a href="#" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Phone className="w-3 h-3" />
                  <span>+91 9539008444</span>
                </a>
                <a href="#" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Mail className="w-3 h-3" />
                  <span>customercare@salmons.in</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Banner */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
            <h1 className="text-lg font-bold text-gray-800 mb-1">Buy Fish</h1>
            <p className="text-sm text-gray-500">
              <a href="#" className="hover:text-[#E55B5B] transition-colors">Home</a>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Buy Fish</span>
            </p>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
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
                  <p className="text-base font-bold text-[#E55B5B]">
                    ₹ {product.price.toFixed(2)}/kg
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs text-gray-400 line-through mt-0.5">
                      ₹ {product.originalPrice.toFixed(2)}/kg
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto">
        {/* Top Footer Tier */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Column 1: Logo */}
              <div className="sm:col-span-2 lg:col-span-1">
                <a href="#" className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-[#E55B5B] tracking-wide">
                    salmons
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 tracking-[0.2em] -mt-1">
                    DEFINITELY FRESH
                  </span>
                </a>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  Premium quality seafood delivered fresh to your doorstep. Experience the taste of the ocean.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Quick Links</h4>
                <ul className="space-y-2.5">
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-[#E55B5B] transition-colors">
                      Why Salmons?
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-[#E55B5B] transition-colors">
                      How Salmons?
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-[#E55B5B] transition-colors">
                      Reach Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Policies */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Policies</h4>
                <ul className="space-y-2.5">
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-[#E55B5B] transition-colors">
                      Terms &amp; Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-[#E55B5B] transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-[#E55B5B] transition-colors">
                      Refund Policy
                    </a>
                  </li>
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
              </div>

              {/* Column 5: Get The Mobile App */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Get The Mobile App</h4>
                <div className="space-y-2.5">
                  {/* App Store Badge */}
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
                  {/* Google Play Badge */}
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
        <div className="bg-[#E55B5B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/90">
                © Salmons, a unit of Hallmark Food Products LLP. Powered by Skywall
              </p>
              <div className="flex items-center gap-3">
                {/* Positive SSL */}
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/15">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[9px] font-semibold text-white">Positive SSL</span>
                </div>
                {/* Visa */}
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/15">
                  <span className="text-xs font-bold italic text-white tracking-tighter">VISA</span>
                </div>
                {/* Mastercard */}
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
