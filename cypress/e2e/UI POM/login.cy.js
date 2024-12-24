import HomePage  from '../../pageObjects/homePage'
import LoginPage from '../../pageObjects/loginPage'

import loginPageData from '../../fixtures/loginPageData.json'

import { ENDPOINTS } from '../../support/endpoints'

const homePage = new HomePage()
const loginPage = new LoginPage()

beforeEach('visit base URL', () => {
    cy.visit('/')
})

describe('User Login', () => {
    it('redirects to login page', () => {
        homePage.clickSighUpLoginLink()
        cy.url().should('eq', Cypress.config('baseUrl') + ENDPOINTS.LOGIN)
        loginPage.getHeaderLoginForm().invoke('text').should('eq', loginPageData.loginForm.headerText )
    })
    
})