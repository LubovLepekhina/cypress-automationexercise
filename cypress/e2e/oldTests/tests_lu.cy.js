/// <reference types='cypress' />

function deleteAcc() {
  cy.get('a[href$="/delete_account"]').click()
  cy.get('h2').contains('Account Deleted!').should('be.visible')
}

describe('1. create new user', () => {
  before(() => {
    cy.visit('/')
    cy.fixture('usersData.json').as('user')
  })
  it('create a new user with all required fields', () => {
    cy.url().should('include', 'https://automationexercise.com')
    cy.title().should('eq', 'Automation Exercise')
    cy.get("a[href$='login']").click()
    cy.get('h2').contains('New User Signup!').should('be.visible')
    cy.get('@user').then((user) => {
      cy.get("input[data-qa='signup-name']").type(user.name)
      cy.get("input[data-qa='signup-email']").type(user.email)
    })
    cy.get("button[data-qa='signup-button']").click()
    cy.url().should('include', '/signup')
    cy.get('h2').contains('Enter Account Information').should('be.visible')

    cy.get('@user').then((user) => {
      if (user.gender === 'female') {
        cy.get("input[id='id_gender2']").check()
      } else if (user.gender === 'male') {
        cy.get("input[id='id_gender1']").check()
      }
      cy.get('input#name').should('have.value', user.name)
      cy.get('input#email').should('have.value', user.email)

      cy.get('.required input').each(($el) => {
        let sel = $el.attr('id')
        cy.log(sel)
        if ($el.attr('value')) {
          return
        } 
        if (user[sel]) {
          cy.wrap($el).clear().type(user[sel])
        }
      })
      cy.get('select#country').select(user.country).should('have.value', 'United States')
    })
    cy.get('button').contains('Create Account').click()

    cy.url().should('include', '/account_created')
    cy.get('h2').contains('Account Created!').should('be.visible')
    cy.get('a').contains('Continue').click()

    cy.get('@user').then((user) => {
      cy.get('a').contains(`Logged in as ${user.name}`).should('be.visible')
    })
  })
  // after(() => {
  //   deleteAcc()
  // })
})

describe('template spec', () => {
  beforeEach(() => {
    // 1. Launch browser
    // 2. Navigate to url 'http://automationexercise.com'
    cy.visit('/')
    cy.fixture('usersData.json').as('user')

  })
  it('2. Login User with correct email and password', () => {
    // 3. Verify that home page is visible successfully
    cy.url().should('include', 'https://automationexercise.com')
    cy.title().should('eq', 'Automation Exercise')

    // 4. Click on 'Signup / Login' button
    cy.get("a[href$='login']").click()

    // 5. Verify 'Login to your account' is visible
    cy.get('h2').contains('Login to your account').should('be.visible')

    // 6. Enter correct email address and password
    cy.get('@user').then((user) => {
      cy.get("input[data-qa='login-email']").type(user.email)
      cy.get("input[data-qa='login-password']").type(user.password)
          // 7. Click 'login' button
      cy.get('button').contains('Login').click()
          // 8. Verify that 'Logged in as username' is visible
      cy.get('a').contains(`Logged in as ${user.name}`).should('be.visible')
    })
    deleteAcc()
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