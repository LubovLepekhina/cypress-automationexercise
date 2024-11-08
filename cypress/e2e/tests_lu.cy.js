/// <reference types='cypress' />

describe('template spec', () => {
  beforeEach(() => {
    // 1. Launch browser
    // 2. Navigate to url 'http://automationexercise.com'
    cy.visit('/')
  })
  it('9. Search Product', () => {
    // 3. Verify that home page is visible successfully
    cy.url().should('include', 'https://automationexercise.com')
    cy.title().should('eq', 'Automation Exercise')

    // 4. Click on 'Products' button
    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    cy.get('.material-icons.card_travel').click()
    cy.url().should('include', '/products')
    cy.contains('h2', 'All Products').should('be.visible')

    // 6. Enter product name in search input and click search button
    cy.get('input#search_product').type('dress')
    cy.get('button#submit_search').click()

    // 7. Verify 'SEARCHED PRODUCTS' is visible
    cy.contains('h2', 'Searched Products').should('be.visible')
    cy.url().should('contain', '/products?search=dress')

    // 8. Verify all the products related to search are visible
    cy.get('.features_items>.col-sm-4').each(($els) => {
      cy.wrap($els).should('be.visible')
    })
  })
})