/**
 * Phase 1 — Jest + RTL smoke test
 * Run: npm run test:jest
 */
import { render, screen } from '@testing-library/react'
import { ProductCardActions } from '@/components/product-card-actions'

describe('ProductCardActions', () => {
  it('renders call and whatsapp buttons', () => {
    render(
      <ProductCardActions phone="+919656200209" whatsappUrl="https://wa.me/919656200209" />
    )
    expect(screen.getByRole('link', { name: /call to order/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument()
  })

  it('has correct tel href', () => {
    render(
      <ProductCardActions phone="+919656200209" whatsappUrl="https://wa.me/919656200209" />
    )
    const link = screen.getByRole('link', { name: /call to order/i })
    expect(link).toHaveAttribute('href', 'tel:+919656200209')
  })
})
