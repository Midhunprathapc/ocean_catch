import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, PhoneCall, MessageCircle, Fish, Truck,
  ShieldCheck, Scale, Droplets, Phone, Mail
} from 'lucide-react'

const COMPANY_PHONE = '+91 9656200209'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id, deletedAt: null } })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.title} — OceanCatch`,
    description: product.description ?? `Buy fresh ${product.title} from OceanCatch. Premium quality, same-day delivery.`,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id, deletedAt: null } })
  if (!product) notFound()

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">

      {/* ── HEADER ── */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <Link href="/" className="flex flex-col items-start">
                <span className="text-2xl font-bold text-[#0891B2] tracking-wide">OceanCatch</span>
                <span className="text-[10px] font-medium text-gray-500 tracking-[0.2em] -mt-1">DEFINITELY FRESH</span>
              </Link>
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-2 bg-[#0891B2] hover:bg-[#0E7490] text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold">
                <PhoneCall className="w-4 h-4" /><span className="hidden sm:inline">Call to Order</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2.5">
              <nav className="flex items-center gap-6">
                <Link href="/" className="bg-[#0891B2] hover:bg-[#0E7490] text-white px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
                  <Fish className="w-4 h-4" />Buy Fish
                </Link>
                <Link href="/story" className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors">OceanCatch Story</Link>
                <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-[#0891B2] transition-colors">Reach Us</Link>
              </nav>
              <div className="hidden sm:flex items-center gap-4">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0891B2] transition-colors">
                  <Phone className="w-3 h-3" />{COMPANY_PHONE}
                </a>
                <a href="mailto:midhunprathap.in@gmail.com" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Mail className="w-3 h-3" />midhunprathap.in@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
            <h1 className="text-lg font-bold text-gray-800 mb-1">{product.title}</h1>
            <p className="text-sm text-gray-500">
              <Link href="/" className="hover:text-[#0891B2] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/" className="hover:text-[#0891B2] transition-colors">Buy Fish</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 truncate">{product.title}</span>
            </p>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0891B2] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />Back to Products
          </Link>

          {/* Product card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">

              {/* Image */}
              <div className="relative w-full md:w-1/2 aspect-square bg-gray-50">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Fish className="w-24 h-24 text-gray-200" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-6 md:p-8 flex flex-col">
                <span className="inline-flex items-center gap-1.5 self-start text-xs font-semibold px-3 py-1 rounded-full bg-[#CFFAFE] text-[#0891B2] mb-3">
                  <Fish className="w-3 h-3" />{product.category}
                </span>

                <h1 className="text-2xl font-bold text-gray-900 tracking-wide mb-2">{product.title}</h1>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-[#0891B2]">
                    ₹ {product.price.toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/{product.unit}</span>
                  </p>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>
                )}

                {!product.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    Fresh {product.title.toLowerCase()} sourced directly from the coast. Hand-picked and quality-checked to ensure you get the freshest catch delivered to your doorstep. Perfect for grilling, frying, or currying.
                  </p>
                )}

                {/* Quick info grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: Scale, label: 'Min. Order', value: `1 ${product.unit}` },
                    { icon: Droplets, label: 'Freshness', value: '100% Fresh' },
                    { icon: ShieldCheck, label: 'Quality', value: 'Premium Grade' },
                    { icon: Truck, label: 'Delivery', value: 'Same Day' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-4 h-4 text-[#0891B2] flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{label}</p>
                        <p className="text-[11px] text-gray-500">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-auto space-y-3">
                  <a
                    href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                    className="w-full bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-5 h-5" />Call to Order
                  </a>
                  <a
                    href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=Hi, I want to order ${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />Order via WhatsApp
                  </a>
                  <p className="text-center text-xs text-gray-400">
                    Call or WhatsApp us at <span className="font-semibold text-gray-600">{COMPANY_PHONE}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why choose section */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, title: '100% Fresh', desc: 'Direct from the coast, same day' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Cold-chain logistics to your door' },
              { icon: Scale, title: 'Right Weight', desc: "What you order is what you get" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-3">
                <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#0891B2]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-auto bg-[#0891B2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/90">© OceanCatch, a unit of Hallmark Food Products LLP.</p>
          <Link href="/" className="text-xs text-white/80 hover:text-white transition-colors">← Back to all products</Link>
        </div>
      </footer>
    </div>
  )
}
