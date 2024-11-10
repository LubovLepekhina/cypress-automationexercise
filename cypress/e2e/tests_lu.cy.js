/// <reference types='cypress' />
import {newUser} from '../fixtures/signUpLogin.json'

describe('template spec', () => {
  beforeEach(() => {
    // 1. Launch browser
    // 2. Navigate to url 'http://automationexercise.com'
    cy.visit('/')
  })
  it.only('2. Login User with correct email and password', () => {
    let email = 'nikole@gmail.com'
    let password = 'nikole'
    let username = 'Nikole'
    // 3. Verify that home page is visible successfully
    cy.url().should('include', 'https://automationexercise.com')
    cy.title().should('eq', 'Automation Exercise')

    // 4. Click on 'Signup / Login' button
    cy.get("a[href$='login']").click()

    // 5. Verify 'Login to your account' is visible
    cy.get('h2').contains('Login to your account').should('be.visible')

    // 6. Enter correct email address and password
    cy.get("input[data-qa='login-email']").type(email)
    cy.get("input[data-qa='login-password']").type(password)

    // 7. Click 'login' button
    cy.get('button').contains('Login').click()

    // 8. Verify that 'Logged in as username' is visible
    cy.get('a').contains(`Logged in as ${username}`).should('be.visible')

    // 9. Click 'Delete Account' button
    cy.get('a[href$="/delete_account"]').click()

    // 10. Verify that 'ACCOUNT DELETED!' is visible
    cy.get('h2').contains('Account Deleted!').should('be.visible')
  })
  it('3. Login User with incorrect email and password', () => {
    // 3. Verify that home page is visible successfully
    cy.url().should('include', 'https://automationexercise.com')
    cy.title().should('eq', 'Automation Exercise')

    // 4. Click on 'Signup / Login' button
    cy.get("a[href$='login']").click()

    // 5. Verify 'Login to your account' is visible
    cy.get('h2').contains('Login to your account').should('be.visible')

    // 6. Enter incorrect email address and password
    cy.get("input[data-qa='login-email']").type('example@example.com')
    cy.get("input[data-qa='login-password']").type('passexample')

    // 7. Click 'login' button
    cy.get('button').contains('Login').click()

    // 8. Verify error 'Your email or password is incorrect!' is visible
    cy.contains('p', 'Your email or password is incorrect!').should('be.visible')
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