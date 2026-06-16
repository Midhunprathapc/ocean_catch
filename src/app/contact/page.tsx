import Link from 'next/link'
import {
  Fish, Phone, Mail, PhoneCall, MessageCircle,
  MapPin, Clock, Facebook, Instagram, ArrowLeft
} from 'lucide-react'

const COMPANY_PHONE = '+91 9656200209'

export const metadata = {
  title: 'Contact Us — OceanCatch',
  description: 'Get in touch with OceanCatch. Call, WhatsApp, or email us to place orders or get support.',
}

export default function ContactPage() {
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
                <Link href="/contact" className="text-sm font-medium text-[#0891B2]">Reach Us</Link>
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
            <h1 className="text-lg font-bold text-gray-800 mb-1">Reach Us</h1>
            <p className="text-sm text-gray-500">
              <Link href="/" className="hover:text-[#0891B2] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Reach Us</span>
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
              <Phone className="w-3 h-3" />Get In Touch
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Reach Us</h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
              Have a question, want to place an order, or just want to say hello? We&apos;re always here to help.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Phone, bg: 'bg-[#0891B2]',
                title: 'Call Us',
                content: <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="text-sm text-[#0891B2] font-semibold hover:underline">{COMPANY_PHONE}</a>,
                sub: 'Mon-Sat, 7AM - 9PM',
              },
              {
                icon: MessageCircle, bg: 'bg-[#25D366]',
                title: 'WhatsApp',
                content: <a href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#25D366] font-semibold hover:underline">Chat with us</a>,
                sub: 'Quick response guaranteed',
              },
              {
                icon: Mail, bg: 'bg-[#0891B2]',
                title: 'Email Us',
                content: <a href="mailto:midhunprathap.in@gmail.com" className="text-sm text-[#0891B2] font-semibold hover:underline">midhunprathap.in@gmail.com</a>,
                sub: 'We reply within 24 hours',
              },
              {
                icon: MapPin, bg: 'bg-[#0891B2]',
                title: 'Visit Us',
                content: <p className="text-sm text-[#0891B2] font-semibold">Kochi, Kerala</p>,
                sub: 'By appointment only',
              },
            ].map(({ icon: Icon, bg, title, content, sub }) => (
              <div key={title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 mx-auto ${bg} rounded-full flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                {content}
                <p className="text-xs text-gray-400 mt-2">{sub}</p>
              </div>
            ))}
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
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" placeholder="Your name" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" placeholder="you@example.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors" />
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
                  <textarea rows={4} placeholder="Write your message here..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold py-3 rounded-lg transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Map placeholder */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] h-56 flex items-center justify-center relative">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-[#0891B2] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#0891B2]">OceanCatch HQ</p>
                    <p className="text-xs text-gray-600">42, Marine Drive, Kochi, Kerala 682031</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" className="w-full">
                      <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Business hours */}
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
                  ].map((s) => (
                    <div key={s.day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700 font-medium">{s.day}</span>
                      <span className={`text-sm font-semibold ${s.active ? 'text-[#0891B2]' : 'text-gray-400'}`}>{s.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center">
                    <span className="text-lg">🌐</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Follow Us</h3>
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"><Facebook className="w-5 h-5" /></a>
                  <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-80 transition-opacity"><Instagram className="w-5 h-5" /></a>
                  <a href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-80 transition-opacity"><MessageCircle className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#0891B2] to-[#065F73] rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Prefer to talk directly?</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">The fastest way to place an order or get help is to call us directly.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 bg-white text-[#0891B2] text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                <PhoneCall className="w-4 h-4" />Call Now
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
                  <li><Link href="/story" className="text-sm text-gray-500 hover:text-[#0891B2] transition-colors">Why OceanCatch?</Link></li>
                  <li><Link href="/contact" className="text-sm text-[#0891B2] font-medium">Reach Us</Link></li>
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
