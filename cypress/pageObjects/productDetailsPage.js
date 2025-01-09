/// <reference types="cypress" />
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

}
export default ProductDetails
