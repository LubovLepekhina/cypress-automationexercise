/// <reference types="cypress" />
import Header from "./headerPage";

class ProductDetails extends Header {
    getNameProductInformation = () => cy.get('.product-information h2')
    getCategoryProductInformation = () => cy.get('.product-information p')
    getPriceProductInformation = () => cy.get('.product-information span span')
    getProductImage = () => cy.get('.view-product img')

}
export default ProductDetails
