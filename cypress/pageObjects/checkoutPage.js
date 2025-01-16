/// <reference types="cypress" />

import CartPage from "./cartPage";

class CheckoutPage extends CartPage {

    getAddressDetailsHeader = () => cy.get('h2').contains('Address Details')
    getReviewYourOrderHeader = () => cy.get('h2').contains('Review Your Order')
    getDeliveryAddressBox = () => cy.get('ul#address_delivery')
    getBillingAddressBox = () => cy.get('#address_invoice')

}
export default CheckoutPage