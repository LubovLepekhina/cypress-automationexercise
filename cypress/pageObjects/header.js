/// <reference types="cypress" />

class Header {
    getSignUpLogin = () => cy.contains('.navbar-nav li', 'Signup / Login')
    getLoggedinAs = () => cy.contains('.navbar-nav li', 'Logged in as')
    getDeleteAccountLink = () => cy.get('a[href="/delete_account"]')

    clickSighUpLoginLink() {
        this.getSignUpLogin().click()
        return this
    }

    clickDeleteAccountLink() {
        this.getDeleteAccountLink().click()
        return this
    }
}

export default Header