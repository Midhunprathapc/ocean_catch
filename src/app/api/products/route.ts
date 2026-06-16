import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/products — fetch all products
export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/products — create a new product
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, price, unit, imageUrl, imageId, inStock } = body

    if (!title || !category || price === undefined) {
      return NextResponse.json({ error: 'title, category, and price are required' }, { status: 400 })
    }

    const product = await db.product.create({
      data: {
        title,
        description: description ?? null,
        category,
        price: parseFloat(price),
        unit: unit ?? 'kg',
        imageUrl: imageUrl ?? null,
        imageId: imageId ?? null,
        inStock: inStock ?? true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
