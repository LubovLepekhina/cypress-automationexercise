/// <reference types="cypress" />

import Header from './headerPage'

class CartPage extends Header {

    getPrices = () => cy.get('td.cart_price')
    getDescription = () => cy.get('a[href*="/product_details/"]')

}

export default CartPage