// Cloudinary upload utility
// Primary:  unsigned browser-to-Cloudinary upload (fast, no server round-trip)
// Fallback: server-side signed upload via /api/upload (when preset is unsigned-restricted)

export const CLOUDINARY_CLOUD_NAME   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ''
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? ''
export const CLOUDINARY_UPLOAD_URL   = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

/**
 * Upload a file to Cloudinary.
 * Tries unsigned browser upload first; if that returns 401 (preset not unsigned),
 * automatically falls back to the server-side signed upload route.
 */
export async function uploadToCloudinary(
  file: File,
  adminSecret?: string
): Promise<{ url: string; publicId: string }> {

  // ── Attempt 1: unsigned browser upload ───────────────────────────────────
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'oceancatch')

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        return { url: data.secure_url, publicId: data.public_id }
      }

      // 401 = preset is not unsigned — fall through to server upload
      if (res.status !== 401) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.error?.message ?? `Cloudinary error ${res.status}`)
      }
      // status 401 — fall through silently
    } catch (e) {
      // Network error on direct upload — fall through to server route
      if (e instanceof Error && !e.message.includes('Cloudinary error')) {
        console.warn('Direct Cloudinary upload failed, trying server route:', e.message)
      } else {
        throw e
      }
    }
  }

  // ── Attempt 2: server-side signed upload via /api/upload ─────────────────
  const secret = adminSecret ??
    (typeof window !== 'undefined' ? sessionStorage.getItem('admin_secret') ?? '' : '')

  const serverForm = new FormData()
  serverForm.append('file', file)

  const serverRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'x-admin-secret': secret },
    body: serverForm,
  })

  if (!serverRes.ok) {
    const errData = await serverRes.json().catch(() => ({}))
    throw new Error(errData?.error ?? `Upload failed (${serverRes.status})`)
  }

  const result = await serverRes.json()
  return { url: result.url, publicId: result.publicId }
}
