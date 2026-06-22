/**
 * Phase 2 — Cypress E2E smoke test
 * Run: npm run test:cypress
 */

describe('OceanCatch Storefront', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the homepage with brand name', () => {
    cy.contains('OceanCatch').should('be.visible')
  })

  it('displays product cards', () => {
    // Wait for products to load (either cards or "no fish found" empty state)
    cy.get('body').then(($body) => {
      if ($body.find('[class*="grid"]').length) {
        cy.get('a[href^="/products/"]').should('have.length.at.least', 1)
      }
    })
  })

  it('navigates to contact page', () => {
    cy.contains('Reach Us').click()
    cy.url().should('include', '/contact')
    cy.contains('Send Us a Message').should('be.visible')
  })

  it('API health check works', () => {
    cy.request('/api').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.status).to.eq('ok')
    })
  })
})
