/// <reference types="cypress" />

import Header from "./headerPage";

class SignupPage extends Header {
    getTitleRadioButtons = () => cy.get('input[type="radio"]')
    getNameInput = () => cy.get('input#name')
    getEmailAddressInput = () => cy.get('input#email')
    getPasswordInput = () => cy.get('input[data-qa="password"]')
    getDateBirth = () => cy.get('select[data-qa="days"]')
    getAllDatesOptions = () => cy.get('#days option:not([value=""])')
    getMonthBirth = () => cy.get('select[data-qa="months"]')
    getYearBirth = () => cy.get('select[data-qa="years"]')
    getFirstNameInput = () => cy.get('input[data-qa="first_name"]')
    getLastNameInput = () => cy.get('input[data-qa="last_name"]')
    getCompanyInput = () => cy.get('input[data-qa="company"]')
    getAddressInput = () => cy.get('input[data-qa="address"]')
    getCountry = () => cy.get('select[data-qa="country"]')
    getStateInput = () => cy.get('input[data-qa="state"]')
    getCityInput = () => cy.get('input[data-qa="city"]')
    getZipCodeInput = () => cy.get('input[data-qa="zipcode"]')
    getMobileNumberInput = () => cy.get('input[data-qa="mobile_number"]')
    getCreateAccountButton = () => cy.get('button[data-qa="create-account"]')

    checkRandomTitleRadioButton() {
        this.getTitleRadioButtons().then(($items) => {
            return Cypress._.sampleSize($items.toArray(), 1)
        }).check()
        return this
    }
    
    verifyNameInput(newUserName) {
        this.getNameInput().should('have.value', newUserName)
        return this
    }

    verifyEmailInput(emailAddress) {
        this.getEmailAddressInput().should('have.value', emailAddress)
        return this
    }

    typePassword(password) {
        this.getPasswordInput().type(password)
        return this
    }

    selectDateOfBirth(dayIdx) {
        this.getDateBirth().select(dayIdx)
        return this
    }

    selectMonthOfBirth(valueIdx) {
        this.getMonthBirth().select(valueIdx)
        return this    
    }

    selectYearOfBirth(yearIdx) {
        this.getYearBirth().select(yearIdx)
        return this    
    }

    typeFirstName(firstName) {
        this.getFirstNameInput().type(firstName)
        return this
    }

    typeLastName(lastName) {
        this.getLastNameInput().type(lastName)
        return this
    }

    typeCompany(companyName) {
        this.getCompanyInput().type(companyName)
        return this
    }

    typeAddress(address) {
        this.getAddressInput().type(address)
        return this
    }

    selectCountry(country) {
        this.getCountry().select(country)
        return this    
    }

    typeState(state) {
        this.getStateInput().type(state)
        return this
    }

    typeCity(city) {
        this.getCityInput().type(city)
        return this
    }

    typeZipCode(zipcode) {
        this.getZipCodeInput().type(zipcode)
        return this
    }

    typeMobileNumber(mobileNumber) {
        this.getMobileNumberInput().type(mobileNumber)
        return this
    }

    clickCreateAccountButton() {
        this.getCreateAccountButton().click()
        return this
    }

}
export default SignupPage