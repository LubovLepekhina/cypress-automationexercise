/// <reference types="cypress" />

import Header from "./headerPage";

class Payment extends Header {

    getNameOnCardInput = () => cy.get('input[data-qa="name-on-card"]')
    getCardNumberInput = () => cy.get('input[data-qa="card-number"]')
    getCvcInput = () => cy.get('input[data-qa="cvc"]')
    getExpiryMonthInput = () => cy.get('input[data-qa="expiry-month"]')
    getExpiryYearInput = () => cy.get('input[data-qa="expiry-year"]')
    getPayAndConfirmOrderButton = () => cy.get('button').contains('Pay and Confirm Order')

}
export default Payment