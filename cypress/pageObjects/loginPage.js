/// <reference types="cypress" />

import Header from "./headerPage"

class LoginPage extends Header {
    getHeadingNewUserSignUp = () => cy.get('.signup-form h2')
    getNewUserSignupNameInput = () => cy.get('input[data-qa="signup-name"]')
    getNewUserSignupEmailAddressInput = () => cy.get('input[data-qa="signup-email"]')
    getSignUpButton = () => cy.get('[data-qa="signup-button"]')
    getHeaderLoginForm = () => cy.get('.login-form h2')
    getEmailFieldLogin = () => cy.get('[data-qa="login-email"]')
    getPassFieldLogin = () => cy.get('[data-qa="login-password"]')
    getLoginButton = () => cy.get('[data-qa="login-button"]')

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

    typeLoginUserEmail(email) {
        this.getEmailFieldLogin().type(email, { delay: 0 })
        return this
    }

    typeLoginUserPassword(password) {
        this.getPassFieldLogin().type(password, { delay: 0 })
        return this
    }

    clickLoginButton() {
        this.getLoginButton().click()
        return this
    }
}

export default LoginPage