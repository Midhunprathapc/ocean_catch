import { NextRequest } from 'next/server'
import { validateAdminSecret } from '@/lib/env'
import { ok, err, adminRateLimit, corsOptions } from '@/lib/api'

export function OPTIONS() { return corsOptions() }

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * POST /api/upload
 * Server-side Cloudinary upload — accepts multipart/form-data with a "file" field.
 * Used as a fallback when the client-side unsigned upload is unavailable.
 * Requires admin secret.
 */
export async function POST(req: NextRequest) {
  const limited = adminRateLimit(req)
  if (limited) return limited

  if (!validateAdminSecret(req.headers.get('x-admin-secret'))) return err('Unauthorized', 401)

  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey      = process.env.CLOUDINARY_API_KEY
  const apiSecret   = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return err('Cloudinary is not configured on the server', 503)
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return err('No file provided', 400)
    if (file.size > MAX_FILE_SIZE) return err('File too large (max 5 MB)', 413)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return err(`File type not allowed. Use: ${ALLOWED_TYPES.join(', ')}`, 415)
    }

    // Build signed upload request
    const timestamp  = Math.floor(Date.now() / 1000)
    const folder     = 'oceancatch'
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`

    // Sign with SHA-256 via Web Crypto API (edge-compatible)
    const encoder   = new TextEncoder()
    const keyData   = encoder.encode(apiSecret)
    const msgData   = encoder.encode(paramsToSign)
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
    const signature = Array.from(new Uint8Array(sigBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

    // Upload to Cloudinary
    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('api_key', apiKey)
    uploadForm.append('timestamp', String(timestamp))
    uploadForm.append('folder', folder)
    uploadForm.append('signature', signature)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    )

    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      console.error('Cloudinary upload failed:', detail)
      return err(detail?.error?.message ?? 'Upload failed', 502)
    }

    const result = await res.json()
    return ok({ url: result.secure_url, publicId: result.public_id }, 201)
  } catch (e) {
    console.error('POST /api/upload error:', e)
    return err('Upload failed', 500)
  }
}
