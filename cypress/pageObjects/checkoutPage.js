/// <reference types="cypress" />

import CartPage from "./cartPage";

class CheckoutPage extends CartPage {

    getAddressDetailsHeader = () => cy.get('h2').contains('Address Details')
    getReviewYourOrderHeader = () => cy.get('h2').contains('Review Your Order')
    getDeliveryAddressBox = () => cy.get('ul#address_delivery')
    getBillingAddressBox = () => cy.get('#address_invoice')
    getPlaceOrderLink = () => cy.get('a[href="/payment"]')

}
export default CheckoutPage