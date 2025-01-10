/// <reference types="cypress" />
import { recurse } from 'cypress-recurse'
import Header from "./headerPage";

class ProductDetails extends Header {
    getNameProductInformation = () => cy.get('.product-information h2')
    getCategoryProductInformation = () => cy.get('.product-information p')
    getPriceProductInformation = () => cy.get('.product-information span span')
    getProductImage = () => cy.get('.view-product img')
    getQuantityInput = () => cy.get('input#quantity')
    getAddToCartBtn = () => cy.get('button').contains('Add to cart')

    verifyDefaultQuantity() {
        this.getQuantityInput().should('have.value', '1')
        return this
    }

    clickUpArrowQuantity() {
        this.getQuantityInput().type('{uparrow}')
        return this
    }

    clickAddToCartBtn() {
        this.getAddToCartBtn().click()
        return this
    }

    getProductInfo() {
        const productInfoObject = {}
        this.getNameProductInformation().invoke('text')
            .then((text) => productInfoObject.productName = text)
            .then(() => this.getCategoryProductInformation().first().invoke('text'))
            .then((text) => productInfoObject.productCategory = text.slice(10))
            .then(() => this.getPriceProductInformation().invoke('text'))
            .then((text) => productInfoObject.productPrice = text.slice(4))
            .then(() => this.getQuantityInput().invoke('val'))
            .then((num) => productInfoObject.productQuantity = num)
            .then(() => productInfoObject.total = String(+productInfoObject.productPrice * +productInfoObject.productQuantity))
        
        return cy.wrap(productInfoObject)
    }

    clickUpperArrowMultipleTimes(number) {
        recurse(
            () => {
                return this.getQuantityInput().invoke('val').then(parseInt)
            },
            //predicate - this function receives whatever is yeildes from the above, which is a number in our case
            //and if numer n === quantity is true recurse is finiched, if false - it executes code in post()actions below
            (n) => n === number,
            {
                delay: 50, // wait a bit between clicks
                // we might need longer then default 4000ms in case of big quantities 
                timeout: 20000,
                log: false,
                //here we indicate what to do if a predicate fails - in our case we perform click()
                post: () => {
                   this.getQuantityInput().type('{uparrow}')
                }
            }
        ).then(actualQuantity => {
            expect(actualQuantity ).to.eq(number)
        })
    }

    invokeValueQuantityInput() {
        return this.getQuantityInput().invoke('val')
    }

}
export default ProductDetails
