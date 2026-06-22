import { db } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Fish, PhoneCall, Mail, Facebook, Instagram, ShieldCheck, ChevronRight, Search } from 'lucide-react'
import { ProductCardActions } from '@/components/product-card-actions'

const COMPANY_PHONE = '8086607878'

const fishCategories = [
  'All',
  'Sea Water Fish',
  'Backwater Fish',
  'Freshwater Fish',
  'Shelled Fish',
  'Imported Fish',
  'Exotic Indian',
  'Ready To Cook',
  'Live Fish',
]

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category ?? 'All'

  const products = await db.product.findMany({
    where: {
      inStock: true,
      deletedAt: null,
      ...(activeCategory !== 'All' ? { category: activeCategory } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">

      {/* ── HEADER ── */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4">
              <Link href="/" className="min-w-0">
                <div className="flex flex-col items-start">
                  <span className="text-base sm:text-2xl font-bold text-[#0891B2] tracking-tight sm:tracking-wide leading-tight">Sea Harvest Premium Seafoods</span>
                  <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 tracking-[0.2em] mt-0.5">DEFINITELY FRESH</span>
                </div>
              </Link>
              <div className="flex items-center gap-3 flex-shrink-0">
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2.5 bg-[#0891B2] hover:bg-[#0E7490] text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span className="hidden sm:inline sm:ml-2">Call to Order</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search fresh fish..."
                className="flex-1 border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2]"
              />
              <button className="flex items-center justify-center w-10 h-10 bg-[#0891B2] hover:bg-[#0E7490] text-white rounded-md transition-colors flex-shrink-0 shadow-sm">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Nav row */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2.5">
              <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 sm:pb-0 whitespace-nowrap">
                <Link href="/" className="bg-[#0891B2] hover:bg-[#0E7490] text-white px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
                  <Fish className="w-4 h-4" />Buy Fish
                </Link>
                <Link href="/story" className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors">Our Story</Link>
                <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors">Reach Us</Link>
              </nav>
              <div className="hidden sm:flex items-center gap-4">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0891B2] transition-colors">
                  <Phone className="w-3 h-3" />{COMPANY_PHONE}
                </a>
                <a href="mailto:tonykannala@gmail.com" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Mail className="w-3 h-3" />tonykannala@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
            <h1 className="text-lg font-bold text-gray-800 mb-1">Buy Fish</h1>
            <p className="text-sm text-gray-500">
              <Link href="/" className="hover:text-[#0891B2] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Buy Fish</span>
            </p>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Category filter */}
          <div className="mb-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {fishCategories.map((cat) => (
                <Link
                  key={cat}
                  href={cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#0891B2] text-white shadow-md shadow-[#0891B2]/20'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0891B2] hover:text-[#0891B2]'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Count + call banner */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{products.length}</span> products
              {activeCategory !== 'All' && (
                <span> in <span className="font-semibold text-[#0891B2]">{activeCategory}</span></span>
              )}
            </p>
            <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#0891B2] hover:text-[#0E7490] transition-colors">
              <PhoneCall className="w-4 h-4" />Call to Order: {COMPANY_PHONE}
            </a>
          </div>

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Fish className="w-16 h-16 mx-auto text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-600 mb-2">No fish found</h3>
              <p className="text-sm text-gray-400">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col group"
                >
                  {/* Clickable item → product detail */}
                  <Link href={`/products/${product.id}`} className="flex flex-row sm:flex-col flex-1 items-center sm:items-stretch p-2.5 sm:p-0">
                    {/* Image */}
                    <div className="relative w-[84px] h-[84px] sm:w-full sm:h-auto sm:aspect-square bg-gray-50 flex-shrink-0 rounded-xl sm:rounded-none overflow-hidden border sm:border-0 border-gray-100/50">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover sm:group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 84px, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          priority={index < 4}
                          loading={index < 4 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Fish className="w-8 h-8 sm:w-16 sm:h-16 text-gray-200" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="pl-4 pr-2 sm:p-4 flex flex-col justify-center flex-1 text-left sm:text-center min-w-0">
                      <h3 className="text-[13px] sm:text-sm font-bold text-gray-900 uppercase tracking-wide mb-1 sm:min-h-[2.5rem] leading-tight">
                        {product.title}
                      </h3>
                      <p className="text-[9px] sm:text-xs text-gray-400 font-medium tracking-wider uppercase mb-1.5 sm:mb-2 truncate">
                        {product.category}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[#0891B2]">
                        ₹ {product.price.toFixed(2)}<span className="text-[10px] sm:text-sm font-medium text-gray-400 lowercase ml-0.5">/{product.unit}</span>
                      </p>
                    </div>

                    {/* Mobile Arrow */}
                    <div className="sm:hidden flex items-center justify-center pr-2 text-gray-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </Link>

                  {/* CTA buttons — visible only on larger screens */}
                  <div className="hidden sm:block px-4 pb-4">
                    <ProductCardActions
                      phone={COMPANY_PHONE.replace(/\s/g, '')}
                      whatsappUrl={`https://wa.me/${'8089993930'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-auto">
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="flex flex-col items-start">
                  <span className="text-xl sm:text-2xl font-bold text-[#0891B2] tracking-wide">Sea Harvest Premium Seafoods</span>
                  <span className="text-[10px] font-medium text-gray-500 tracking-[0.2em] -mt-1">DEFINITELY FRESH</span>
                </div>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  Premium quality seafood delivered fresh to your doorstep.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Quick Links</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/story" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Why Sea Harvest Premium Seafoods?</Link></li>
                  <li><Link href="/contact" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Reach Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Policies</h4>
                <ul className="space-y-2.5">
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Terms &amp; Conditions</a></li>
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Refund Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-80 transition-opacity">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
                <div className="mt-4">
                  <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
                    <PhoneCall className="w-3.5 h-3.5" />Call to Order
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#0891B2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/90">© Sea Harvest Premium Seafoods, a unit of Hallmark Food Products LLP.</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/15 text-[9px] font-semibold text-white">
                <ShieldCheck className="w-3 h-3" />SSL Secured
              </span>
              <span className="px-2 py-1 rounded bg-white/15 text-xs font-bold italic text-white tracking-tighter">VISA</span>
              <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/15 text-[9px] font-semibold text-white">
                <span className="flex -space-x-1.5"><span className="w-3 h-3 rounded-full bg-[#EB001B] opacity-80 inline-block" /><span className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-80 inline-block" /></span>Mastercard
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
