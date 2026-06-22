/**
 * Phase 1 — Vitest smoke test
 * Run: npm run test:vitest
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('validateAdminSecret', () => {
  beforeEach(() => {
    vi.stubEnv('ADMIN_SECRET', 'oceancatch-admin')
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost/test')
    vi.stubEnv('DIRECT_URL', 'postgresql://test:test@localhost/test')
    vi.resetModules()
  })

  it('returns true for matching secret', async () => {
    const { validateAdminSecret } = await import('@/lib/env')
    expect(validateAdminSecret('oceancatch-admin')).toBe(true)
  })

  it('returns false for wrong secret', async () => {
    const { validateAdminSecret } = await import('@/lib/env')
    expect(validateAdminSecret('wrong-secret')).toBe(false)
  })

  it('returns false for null', async () => {
    const { validateAdminSecret } = await import('@/lib/env')
    expect(validateAdminSecret(null)).toBe(false)
  })
})
