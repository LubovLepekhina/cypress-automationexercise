/// <reference types="cypress" />

import Header from "./headerPage";

class PaymentPage extends Header {

    getNameOnCardInput = () => cy.get('input[data-qa="name-on-card"]')
    getCardNumberInput = () => cy.get('input[data-qa="card-number"]')
    getCVCInput = () => cy.get('input[data-qa="cvc"]')
    getExpiryMonthInput = () => cy.get('input[data-qa="expiry-month"]')
    getExpiryYearInput = () => cy.get('input[data-qa="expiry-year"]')
    getPayAndConfirmOrderButton = () => cy.get('button').contains('Pay and Confirm Order')

    clickPayAndConfirmOrderButton() {
        this.getPayAndConfirmOrderButton().click()
        return this
    }

    fillCardInformation(creditCardInfo) {
        this.getNameOnCardInput().type(creditCardInfo.cardHolder)
        this.getCardNumberInput().type(creditCardInfo.cardNumber)
        this.getCVCInput().type(creditCardInfo.cvc)
        this.getExpiryMonthInput().type(creditCardInfo.expiryData().expiryMonth)
        this.getExpiryYearInput().type(creditCardInfo.expiryData().expiryYear)
        return this
    }

}
export default PaymentPage