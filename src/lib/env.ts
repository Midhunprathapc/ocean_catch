/**
 * Environment variable validation.
 * Throws at startup if any required variable is missing.
 * Import this in any server-side code that needs env vars.
 */

function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val || val.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return val.trim()
}

function optionalEnv(key: string, fallback = ''): string {
  return process.env[key]?.trim() ?? fallback
}

// ─── Validated env object ─────────────────────────────────────────────────────
export const env = {
  // Database
  DATABASE_URL: requireEnv('DATABASE_URL'),
  DIRECT_URL:   requireEnv('DIRECT_URL'),

  // Admin
  ADMIN_SECRET: requireEnv('ADMIN_SECRET'),

  // Cloudinary (public — available client + server)
  CLOUDINARY_CLOUD_NAME:   optionalEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_UPLOAD_PRESET: optionalEnv('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'),

  // Node env
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  isProd: process.env.NODE_ENV === 'production',
  isDev:  process.env.NODE_ENV !== 'production',
}

// ─── Admin secret validator ───────────────────────────────────────────────────
/**
 * Constant-time string comparison to prevent timing attacks.
 * Use this instead of `secret === process.env.ADMIN_SECRET`
 */
export function validateAdminSecret(incoming: string | null): boolean {
  if (!incoming) return false
  const expected = process.env.ADMIN_SECRET ?? ''
  if (incoming.length !== expected.length) return false

  let mismatch = 0
  for (let i = 0; i < expected.length; i++) {
    mismatch |= incoming.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}
