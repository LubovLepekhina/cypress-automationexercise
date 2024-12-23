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
import {accountInformation} from '../../fixtures/signupPageData.json'

import { ENDPOINTS } from '../../support/endpoints'

const loginPage = new LoginPage()
const homePage = new HomePage()
const signupPage = new SignupPage()
const accountCreatedPage = new AccountCreatedPage()
const header = new Header()

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

    it('Create new user via API POST request', () => {
        let newUser = genData.newUser()
        cy.createAccountAPI(newUser)
        cy.visit('/').log('delete an account')
        header.clickDeleteAccountLink()
    })

    accountInformation.inputsList.forEach(inputName => {
        it(`The entered text is displayed correctly in the ${inputName} field`, () => {
            let newUser = genData.newUser()
            let methodName = `get${inputName}Input`
            let genDataKey = inputName[0].toLowerCase() + inputName.slice(1)

            cy.newUserSignUp(newUser)
            
            signupPage[methodName]().type(newUser[genDataKey])
                .should('have.value', newUser[genDataKey])
        })
    })

    accountInformation.title.forEach((title, idx) => {
        it(`checks ${title} radio button`, () => {
            let newUser = genData.newUser()
            cy.newUserSignUp(newUser)
            signupPage.getTitleRadioButtons().eq(idx)
                .should('be.visible')
                .and('not.be.checked')
                .check()
                .should('be.checked')
        })
    })

    accountInformation.title.forEach((title, idx) => {
        it(`verify ${title} radio button label text`, () => {
            let newUser = genData.newUser()
            cy.newUserSignUp(newUser)
            signupPage.getLabelTitleRadioButtons().eq(idx)
                .should('be.visible')
                .invoke('text').then(($text) => {
                    expect($text.trim()).to.eq(title)
                })
        })
    })

    it('Mrs. radio button should be unchecked if Mr. is checked and vv', () => {
        let newUser = genData.newUser()
            cy.newUserSignUp(newUser)
            signupPage.getTitleRadioButtons().should('not.be.checked')
            signupPage.getTitleRadioButtons().eq(0).should('not.be.checked').check().should('be.checked')
            signupPage.getTitleRadioButtons().eq(1).should('not.be.checked').check().should('be.checked')
            signupPage.getTitleRadioButtons().eq(0).should('not.be.checked')
    })

})