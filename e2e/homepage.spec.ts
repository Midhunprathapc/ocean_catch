/**
 * Phase 2 — Playwright E2E smoke test
 * Run: npx playwright test
 */
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads and renders the page title', async ({ page }) => {
    await page.goto('/')
    // Page should have a heading or visible text content
    await expect(page.locator('header')).toBeVisible()
  })

  test('shows category filter buttons', async ({ page }) => {
    await page.goto('/')
    // Use exact match with getByRole for the "All" link
    await expect(page.getByRole('link', { name: 'All', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sea Water Fish' }).first()).toBeVisible()
  })

  test('has call to order button in header', async ({ page }) => {
    await page.goto('/')
    // Target the first Call to Order link in the header/banner area
    const headerCTA = page.getByRole('banner').getByRole('link').filter({ hasText: /Call to Order/i }).first()
    await expect(headerCTA).toBeVisible()
  })

  test('API health check returns ok', async ({ request }) => {
    const res = await request.get('/api')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.status).toBe('ok')
  })
})
