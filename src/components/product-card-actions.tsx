'use client'

import { PhoneCall, MessageCircle } from 'lucide-react'

interface ProductCardActionsProps {
  phone: string
  whatsappUrl: string
}

export function ProductCardActions({ phone, whatsappUrl }: ProductCardActionsProps) {
  return (
    <div className="space-y-2">
      <a
        href={`tel:${phone}`}
        className="w-full bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <PhoneCall className="w-4 h-4" />Call to Order
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />WhatsApp
      </a>
    </div>
  )
}
