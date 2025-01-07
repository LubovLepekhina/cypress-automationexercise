/// <reference types="cypress" />
import Header from './headerPage'

class ProductsPage extends Header {
    getAllProductCards = () => cy.get('div.features_items>div.col-sm-4')
    getProductCardInfo = () => cy.get('.productinfo')
    getConfirmPopUp = () => cy.get('div.modal-content')
    getModalShoppingContinueBtn = () => cy.get('button').contains('Continue Shopping')
    getModalViewCartLink = () => cy.get('.modal-body a[href="/view_cart"]')
    getOverlayAddtoCartBtn = () => cy.contains('.overlay-content .btn', 'Add to cart')


    findRandomProductCard() {
        return this.getAllProductCards().then(($cards) => {
            const randomIndex = Math.floor(Math.random() * $cards.length)
            return $cards[randomIndex]           
        })
    }
    
    chooseProductCardByIndex(index) {
        return this.getAllProductCards().eq(index)
    }

    generateRandomIndexProductCard() {
        return this.getAllProductCards().its('length').then((n) => {
            let index = Cypress._.random(0, n - 1) 
            return cy.wrap(index)
        })
    }

    addProductToCart(index) {
        this.getAllProductCards().eq(index).within((productCard) => {
            cy.wrap(productCard).trigger('mouseover')
            this.getOverlayAddtoCartBtn().click({force: true})
        })
        return this
    }


    hoverAndClickAddToCart(randomCard) {
        cy.wrap(randomCard).trigger('mouseover')
        cy.wrap(randomCard).contains('Add to cart').click()
        return this
    }

    clickOverlayContentAddToCart(index) {
        this.getOverlayAddtoCartBtn().eq(index).click({force: true})
        return this
    }

    getInfoFromRandomCard(randomCard) {
        return cy.wrap(randomCard).then((card) => {
            const price = card.find('h2').first().text();
            const description = card.find('p').first().text();
            console.log(price, description)
            return {
                'price': price,
                'description': description
            }; 
        });
    }

    retrieveInfoFromProductCard(index) {
        return this.getAllProductCards().eq(index).then((card) => {
            let productCardObj = {}
            cy.wrap(card).find('h2').first().invoke('text').then(text => {
                productCardObj.price = text
            })
            cy.wrap(card).find('p').first().invoke('text').then(text => {
                productCardObj.description = text
            })
            return cy.wrap(productCardObj)
        })
    }

    clickModalShoppingContinueBtn() {
        this.getModalShoppingContinueBtn().click()
        return this
    }

    clickModalViewCartLink() {
        this.getModalViewCartLink().click()
        return this
    }

}

export default ProductsPage