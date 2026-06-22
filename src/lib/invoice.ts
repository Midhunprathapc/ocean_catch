/**
 * Client-side PDF invoice generator using jsPDF.
 * Runs entirely in the browser — no server required.
 */

import jsPDF from 'jspdf'

export interface InvoiceItem {
  productName: string
  price: number
  unit: string
  quantity: number
}

export interface InvoiceData {
  invoiceNumber: string
  date: string
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  items: InvoiceItem[]
  totalAmount?: number | null
  notes?: string | null
  status: string
}

const BRAND = {
  name: 'Sea Harvest Premium Seafoods',
  tagline: 'DEFINITELY FRESH',
  phone: '+91 9656200209',
  email: 'midhunprathap.in@gmail.com',
  address: 'Kochi, Kerala, India',
  primary: [8, 145, 178] as [number, number, number],     // #0891B2
  primaryDark: [14, 116, 144] as [number, number, number], // #0E7490
  light: [207, 250, 254] as [number, number, number],      // #CFFAFE
}

function hexToRgb(r: number, g: number, b: number) {
  return { r, g, b }
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 14
  let y = 0

  // ── Header band ────────────────────────────────────────────────────────────
  doc.setFillColor(...BRAND.primary)
  doc.rect(0, 0, W, 38, 'F')

  // Brand name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text(BRAND.name, margin, 16)

  // Tagline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(207, 250, 254)
  doc.text(BRAND.tagline, margin, 22)

  // INVOICE label right side
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text('INVOICE', W - margin, 16, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(207, 250, 254)
  doc.text(`#${data.invoiceNumber}`, W - margin, 22, { align: 'right' })

  y = 48

  // ── Two-column info section ────────────────────────────────────────────────
  const colL = margin
  const colR = W / 2 + 4

  // Bill To
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...BRAND.primary)
  doc.text('BILL TO', colL, y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text(data.customerName, colL, y + 6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(71, 85, 105)
  doc.text(data.customerPhone, colL, y + 12)
  if (data.customerEmail) doc.text(data.customerEmail, colL, y + 18)

  // Invoice details
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...BRAND.primary)
  doc.text('INVOICE DETAILS', colR, y)

  const details = [
    ['Date:', data.date],
    ['Status:', data.status],
  ]
  doc.setFontSize(8.5)
  details.forEach(([label, value], i) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(label, colR, y + 6 + i * 7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(value, colR + 22, y + 6 + i * 7)
  })

  y += 36

  // ── Thin separator ─────────────────────────────────────────────────────────
  doc.setDrawColor(...BRAND.light)
  doc.setLineWidth(0.5)
  doc.line(margin, y, W - margin, y)
  y += 8

  // ── Items table header ─────────────────────────────────────────────────────
  doc.setFillColor(...BRAND.primary)
  doc.roundedRect(margin, y, W - margin * 2, 9, 2, 2, 'F')

  const cols = { item: margin + 3, qty: 118, unit: 138, price: 158, total: W - margin - 3 }
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text('ITEM', cols.item, y + 6)
  doc.text('QTY', cols.qty, y + 6)
  doc.text('UNIT', cols.unit, y + 6)
  doc.text('PRICE', cols.price, y + 6)
  doc.text('TOTAL', cols.total, y + 6, { align: 'right' })
  y += 13

  // ── Items ──────────────────────────────────────────────────────────────────
  let subtotal = 0
  data.items.forEach((item, i) => {
    const rowTotal = item.price * item.quantity
    subtotal += rowTotal

    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.rect(margin, y - 3, W - margin * 2, 8, 'F')
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(15, 23, 42)
    // Truncate long names
    const name = item.productName.length > 38 ? item.productName.slice(0, 36) + '…' : item.productName
    doc.text(name, cols.item, y + 2)

    doc.setTextColor(71, 85, 105)
    doc.text(String(item.quantity), cols.qty, y + 2)
    doc.text(item.unit, cols.unit, y + 2)
    doc.text(`₹${item.price.toFixed(2)}`, cols.price, y + 2)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(8, 145, 178)
    doc.text(`₹${rowTotal.toFixed(2)}`, cols.total, y + 2, { align: 'right' })

    y += 9
  })

  y += 4

  // ── Totals box ─────────────────────────────────────────────────────────────
  const total = data.totalAmount ?? subtotal
  const boxX = W - margin - 70
  const boxW = 70

  doc.setFillColor(240, 253, 254)
  doc.roundedRect(boxX, y, boxW, data.notes ? 24 : 17, 3, 3, 'F')
  doc.setDrawColor(...BRAND.light)
  doc.setLineWidth(0.4)
  doc.roundedRect(boxX, y, boxW, data.notes ? 24 : 17, 3, 3, 'S')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text('Subtotal', boxX + 4, y + 7)
  doc.setTextColor(15, 23, 42)
  doc.text(`₹${subtotal.toFixed(2)}`, boxX + boxW - 4, y + 7, { align: 'right' })

  // Divider
  doc.setDrawColor(...BRAND.light)
  doc.line(boxX + 4, y + 10, boxX + boxW - 4, y + 10)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...BRAND.primary)
  doc.text('TOTAL', boxX + 4, y + 17)
  doc.text(`₹${total.toFixed(2)}`, boxX + boxW - 4, y + 17, { align: 'right' })

  if (data.notes) {
    y += 24 + 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...BRAND.primary)
    doc.text('NOTES', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(71, 85, 105)
    const noteLines = doc.splitTextToSize(data.notes, W - margin * 2)
    doc.text(noteLines, margin, y + 6)
    y += 6 + noteLines.length * 5
  } else {
    y += 24 + 8
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  const footerY = 272
  doc.setFillColor(...BRAND.primary)
  doc.rect(0, footerY, W, 25, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text('Thank you for your order!', W / 2, footerY + 7, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(207, 250, 254)
  doc.text(`${BRAND.phone}  •  ${BRAND.email}  •  ${BRAND.address}`, W / 2, footerY + 13, { align: 'center' })
  doc.text('© Sea Harvest Premium Seafoods — Hallmark Food Products LLP', W / 2, footerY + 19, { align: 'center' })

  return doc
}

/** Download the PDF directly in the browser */
export function downloadInvoice(data: InvoiceData): void {
  const doc = generateInvoicePDF(data)
  doc.save(`OceanCatch-Invoice-${data.invoiceNumber}.pdf`)
}

/** Return the PDF as a base64 data URI (for preview or sharing) */
export function invoiceToDataUri(data: InvoiceData): string {
  const doc = generateInvoicePDF(data)
  return doc.output('datauristring')
}

/** Return the PDF as a Blob (for upload or sharing) */
export function invoiceToBlob(data: InvoiceData): Blob {
  const doc = generateInvoicePDF(data)
  return doc.output('blob')
}
