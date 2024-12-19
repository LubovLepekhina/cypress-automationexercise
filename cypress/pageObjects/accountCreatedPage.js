/// <reference types="cypress" />
import Header from "./headerPage"

class AccountCreatedPage extends Header {
    getHeader = () => cy.get('h2[data-qa="account-created"]')
    getPageTextLine1 = () => cy.get('#form p:nth-child(2)')
    getPageTextLine2 = () => cy.get('#form p:nth-child(3)') 
    getContinueButton = () => cy.get('[data-qa="continue-button"]')

    clickContinueButton() {
        this.getContinueButton().click()
        return this
    }

}

export default AccountCreatedPage