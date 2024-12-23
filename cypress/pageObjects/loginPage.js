/// <reference types="cypress" />

class LoginPage {
    getNewUserSignupNameInput = () => cy.get('input[data-qa="signup-name"]')
    getNewUserSignupEmailAddressInput = () => cy.get('input[data-qa="signup-email"]')
    getSignUpButton = () => cy.get('[data-qa="signup-button"]')
    getHeaderLoginForm = () => cy.get('.login-form h2')

    typeNewUserName(name) {
        this.getNewUserSignupNameInput().type(name)
        return this
    }

    typeNewUserEmail(email) {
        this.getNewUserSignupEmailAddressInput().type(email)
        return this
    }

    clickSignUpButton() {
        this.getSignUpButton().click()
        return this
    }
    
}

export default LoginPage