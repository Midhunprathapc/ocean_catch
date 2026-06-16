import Link from 'next/link'
import {
  Fish, Phone, Mail, PhoneCall, MessageCircle,
  ShieldCheck, Truck, Scale, ArrowLeft, Facebook, Instagram
} from 'lucide-react'

const COMPANY_PHONE = '+91 9656200209'

export const metadata = {
  title: 'Why OceanCatch — OceanCatch',
  description: 'Learn about OceanCatch — how we source fresh seafood directly from Kerala fishermen and deliver to your doorstep.',
}

export default function StoryPage() {
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
                <Link href="/story" className="text-sm font-medium text-[#0891B2]">OceanCatch Story</Link>
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
            <h1 className="text-lg font-bold text-gray-800 mb-1">Why OceanCatch</h1>
            <p className="text-sm text-gray-500">
              <Link href="/" className="hover:text-[#0891B2] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Why OceanCatch</span>
            </p>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0891B2] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Link>

          {/* Hero */}
          <div className="bg-gradient-to-br from-[#0891B2] to-[#065F73] rounded-2xl overflow-hidden mb-12 px-8 md:px-16 py-16 md:py-20">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white/90 mb-4">
              <Fish className="w-3 h-3" />Our Story
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Why OceanCatch?</h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
              We believe everyone deserves access to the freshest seafood. That&apos;s why we go straight from the ocean to your doorstep — no middlemen, no delays, no compromises.
            </p>
          </div>

          {/* Origin story */}
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
                <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                  <p>OceanCatch was born from a simple observation: the seafood on our plates often traveled through too many hands before reaching us. By the time it arrived, freshness was compromised and prices were inflated.</p>
                  <p>Founded in 2020 in Kochi, Kerala — the heart of India&apos;s fishing coast — we set out to change that. We built direct relationships with local fishermen and created a supply chain that gets fish from the boat to your door in hours, not days.</p>
                  <p>What started as a small operation serving Kochi has now grown into a trusted seafood brand delivering across Kerala, Karnataka, and Tamil Nadu — always with the same promise: <span className="font-semibold text-[#0891B2]">Definitely Fresh.</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '2020', label: 'Founded' },
                    { value: '500+', label: 'Fishermen Partners' },
                    { value: '50K+', label: 'Happy Customers' },
                    { value: '3', label: 'States Served' },
                  ].map(({ value, label }) => (
                    <div key={label} className="bg-[#CFFAFE] rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-[#0891B2]">{value}</p>
                      <p className="text-xs text-gray-600 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
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
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#CFFAFE] rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">{f.icon}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Promise */}
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: ShieldCheck, title: '100% Fresh', desc: 'Or your money back' },
                  { icon: Truck, title: 'On-Time Delivery', desc: 'Guaranteed delivery slot' },
                  { icon: Scale, title: 'Right Weight', desc: 'What you order is what you get' },
                  { icon: PhoneCall, title: '24/7 Support', desc: 'Call us anytime for help' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="text-center p-4">
                    <div className="w-14 h-14 mx-auto bg-[#0891B2] rounded-full flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#0891B2] to-[#065F73] rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to taste the difference?</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">Call us now to place your order and experience the freshest seafood you&apos;ve ever had.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 bg-white text-[#0891B2] text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                <PhoneCall className="w-4 h-4" />Call to Order
              </a>
              <a href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1DA851] transition-colors">
                <MessageCircle className="w-4 h-4" />WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-auto">
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <span className="text-2xl font-bold text-[#0891B2] tracking-wide">OceanCatch</span>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">Premium quality seafood delivered fresh to your doorstep.</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Quick Links</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/story" className="text-sm text-[#0891B2] font-medium">Why OceanCatch?</Link></li>
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
                  <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"><Facebook className="w-4 h-4" /></a>
                  <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-80 transition-opacity"><Instagram className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#0891B2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-xs text-white/90 text-center">© OceanCatch, a unit of Hallmark Food Products LLP.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
