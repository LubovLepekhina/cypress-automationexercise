/// <reference types="cypress" />

import LoginPage from '../../pageObjects/loginPage'
import HomePage  from '../../pageObjects/homePage'
import SignupPage from '../../pageObjects/signupPage'
import AccountCreatedPage from '../../pageObjects/accountCreatedPage'
import Header from '../../pageObjects/header'

import genData from '../../fixtures/genData'
import accountCreatedData from '../../fixtures/accountCreatedPage.json'
import headerData from '../../fixtures/header.json'

const loginPage = new LoginPage()
const homePage = new HomePage()
const signupPage = new SignupPage()
const accountCreatedPage = new AccountCreatedPage()
const header = new Header()

let newUser = genData.newUser()

beforeEach('visit base URL', () => {
    cy.visit('/')
})

describe('register a new user', () => {
    it('creates a new user', () => {
        homePage
            .clickSighUpLoginLink()
        loginPage
            .typeNewUserName(newUser.name)
            .typeNewUserEmail(newUser.emailAddress)
            .clickSignUpButton()
        signupPage 
            .checkRandomTitleRadioButton()
            .verifyNameInput(newUser.name)  
            .verifyEmailInput(newUser.emailAddress)
            .typePassword(newUser.password)
            .selectDateOfBirth(newUser.birthDate.dateOfBirth)
            .selectMonthOfBirth(newUser.birthDate.monthOfBirth)
            .selectYearOfBirth(newUser.birthDate.yearOfBirth)
            .typeFirstName(newUser.firstName)
            .typeLastName(newUser.lastName)
            .typeCompany(newUser.company)
            .typeAddress(newUser.address)
            .selectCountry(newUser.country)
            .typeState(newUser.state)
            .typeCity(newUser.city)
            .typeZipCode(newUser.zipCode)
            .typeMobileNumber(newUser.mobileNumber)
            .clickCreateAccountButton()
            
        accountCreatedPage.getHeader().should('contain', accountCreatedData.pageText.header)
        accountCreatedPage.getPageTextLine1().should('contain', accountCreatedData.pageText.text_1)
        accountCreatedPage.getPageTextLine2().should('contain', accountCreatedData.pageText.text_2)
        
        accountCreatedPage.clickContinueButton()

        header.getLoggedinAs().should('contain', headerData.navbarItems.registeredUser.slice(-1) + `${newUser.name}`)
        
        cy.log('delete an account')
        header.clickDeleteAccountLink()
    })
})