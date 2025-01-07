/// <reference types="cypress" />

class Header {
    getSignUpLogin = () => cy.contains('.navbar-nav li', 'Signup / Login')
    getLoggedinAs = () => cy.contains('.navbar-nav li', 'Logged in as')
    getDeleteAccountLink = () => cy.get('a[href="/delete_account"]')
    getLogOutLink = () => cy.get('a[href="/logout"]')
    getProductsLink = () => cy.get('.navbar-nav a[href="/products"]')
    getCartLink = () => cy.get('a[href="/view_cart"]').first()

    clickSighUpLoginLink() {
        this.getSignUpLogin().click()
        return this
    }

    clickDeleteAccountLink() {
        this.getDeleteAccountLink().click()
        return this
    }

    clickLogOutLink() {
        this.getLogOutLink().click()
        return this
    }

    clickProductsLink() {
        this.getProductsLink().click()
        return this
    }

    clickCartLink() {
        this.getCartLink().click()
        return this
    }
}

export default Header