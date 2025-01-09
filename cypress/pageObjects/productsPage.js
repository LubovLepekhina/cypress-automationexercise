/// <reference types="cypress" />
import Header from './headerPage'

class ProductsPage extends Header {
    getAllProductCards = () => cy.get('div.features_items>div.col-sm-4')
    getProductCardInfo = () => cy.get('.productinfo')
    getViewProductLink = () => cy.get('a[href*="/product_details/"]')
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
            return Cypress._.random(0, n - 1)
        })
    }

    addProductToCart(index) {
        this.getAllProductCards().eq(index).within((productCard) => {
            cy.wrap(productCard)
                .scrollIntoView()
                .trigger('mouseover')  
            this.getOverlayAddtoCartBtn()
                //.should('be.visible') 
                .should('not.be.disabled')
                .click({force: true})
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
            cy.wrap(card).find('img').invoke('attr', 'src').then(text => {
                productCardObj.imageLink = text
            })
            return cy.wrap(productCardObj)
        })
    }

}

export default ProductsPage