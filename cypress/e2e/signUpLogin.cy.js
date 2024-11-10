/// <reference types='cypress' />
import { newUser } from "../fixtures/signUpLogin.json"
import { textMessage } from "../fixtures/signUpLogin.json"
import { navigationBarItems } from "../fixtures/signUpLogin.json"

describe('Register User', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('registers a new user with valid credentials', () => {
        cy.get('img[src*="logo"]').should('be.visible')
        cy.get('a[href*="login"]').click()
        cy.get('.signup-form h2').should('be.visible')
        //enter account info
        cy.get('input[placeholder="Name"]')
            .type(newUser.credentials.name)
            .should('have.value', newUser.credentials.name)
        cy.get('input[data-qa="signup-email"]')
            .type(newUser.credentials.emailAdress)
            .should('have.value', newUser.credentials.emailAdress)
        cy.get('button[data-qa="signup-button"]').click()
        //enter account info
        cy.get('h2.title:first-child b').should('be.visible')
        cy.get('input#id_gender2')
            .should('not.be.checked')
            .check()
            .should('be.checked')
        cy.get('input#name').should('have.value', newUser.credentials.name)
        cy.get('input#email').should('have.value', newUser.credentials.emailAdress)
        cy.get('input[data-qa="password"]')
            .type(newUser.credentials.password)
            .should('have.value', newUser.credentials.password)

        //drop down menu
        cy.get('select[data-qa="days"]').select(newUser.personalDetails.birthDay)
        cy.get('select[data-qa="days"]').should('have.value', newUser.personalDetails.birthDay)
        cy.get('select[data-qa="days"] option:selected').should('have.text', newUser.personalDetails.birthDay)

        cy.get('select[data-qa="months"]').select(newUser.personalDetails.month)
        cy.get('select[data-qa="months"] option:selected').should('have.text', newUser.personalDetails.month)

        cy.get('select[data-qa="years"]').select(newUser.personalDetails.year)
        cy.get('select[data-qa="years"]').should('have.value', newUser.personalDetails.year)
        cy.get('select[data-qa="years"] option:selected').should('have.text', newUser.personalDetails.year)

        // address information
        cy.get('input[data-qa="first_name"]').type(newUser.personalDetails.firstName)
        cy.get('input[data-qa="last_name"]').type(newUser.personalDetails.lastName)
        cy.get('input[data-qa="company"]').type(newUser.personalDetails.companyName)
        cy.get('input[data-qa="address"]').type(newUser.personalDetails.address)
        cy.get('select[data-qa="country"]').select(newUser.personalDetails.country)
        cy.get('input[data-qa="state"]').type(newUser.personalDetails.state)
        cy.get('input[data-qa="city"]').type(newUser.personalDetails.city)
        cy.get('input[data-qa="zipcode"]').type(newUser.personalDetails.zipCode)
        cy.get('input[data-qa="mobile_number"]').type(newUser.personalDetails.mobileNumber)

        cy.get('button[data-qa="create-account"]').click()
        cy.get('h2[data-qa="account-created"] b')
            .should('be.visible')
            .and('have.text', textMessage.createdAccount)

        cy.get('a[data-qa="continue-button"]').click()
        cy.get('ul.navbar-nav li:last-child a').then(($el) => {
            expect($el.text().trim()).to.be.eq(navigationBarItems.loggedInAsItem10 + ' ' + newUser.credentials.name)
        })

        // delete the user
        cy.get('a[href*="delete_account"]').click()
        cy.get('h2[data-qa="account-deleted" ] b')
            .should('be.visible')
            .and('contain', textMessage.deletedAccount)
        cy.get('a[href][data-qa="continue-button"]').click()
    })
})