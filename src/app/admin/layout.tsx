import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Sea Harvest Premium Seafoods',
  description: 'Sea Harvest Premium Seafoods admin control panel',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
