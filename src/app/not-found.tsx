import Link from 'next/link'
import { Fish } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#CFFAFE] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Fish className="w-10 h-10 text-[#0891B2]" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 text-sm mb-8">This page slipped away like a fish.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
