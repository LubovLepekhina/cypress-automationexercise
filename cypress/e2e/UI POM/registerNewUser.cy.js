/// <reference types="cypress" />

import LoginPage from '../../pageObjects/loginPage'
import HomePage  from '../../pageObjects/homePage'
import SignupPage from '../../pageObjects/signupPage'
import AccountCreatedPage from '../../pageObjects/accountCreatedPage'
import Header from '../../pageObjects/headerPage'

import genData from '../../fixtures/genData'
import accountCreatedData from '../../fixtures/accountCreatedPageData.json'
import headerData from '../../fixtures/headerData.json'
import {signupPageErrorData} from '../../fixtures/errorData.json'

const loginPage = new LoginPage()
const homePage = new HomePage()
const signupPage = new SignupPage()
const accountCreatedPage = new AccountCreatedPage()
const header = new Header()

// let newUser = genData.newUser()

beforeEach('visit base URL', () => {
    cy.visit('/')
})

describe('register a new user', () => {
    it('creates a new user', () => {
        let newUser = genData.newUser()
        
        cy.newUserSignUp(newUser)
        cy.createAccount(newUser)
            
        accountCreatedPage.getHeader().should('contain', accountCreatedData.pageText.header)
        accountCreatedPage.getPageTextLine1().should('contain', accountCreatedData.pageText.text_1)
        accountCreatedPage.getPageTextLine2().should('contain', accountCreatedData.pageText.text_2)
        
        accountCreatedPage.clickContinueButton()

        header.getLoggedinAs().should('contain', headerData.navbarItems.registeredUser.slice(-1) + `${newUser.name}`)
        
        cy.log('delete an account')
        header.clickDeleteAccountLink()
    })

    it('register User with existing email', () => {
        let newUser = genData.newUser()
        
        cy.log('preconditions')
        cy.newUserSignUp(newUser)
        cy.createAccount(newUser)
        accountCreatedPage.getHeader().should('contain', accountCreatedData.pageText.header)
        accountCreatedPage.clickContinueButton()
        cy.contains('a', `Logged in as ${newUser.name}`).should('be.visible')
        header.clickLogOutLink()

        cy.log('body')
        cy.newUserSignUp(newUser)        
        cy.contains('p', signupPageErrorData.errorText).should('be.visible')
            .and('have.css', 'color', signupPageErrorData.cssColor)

    })
})