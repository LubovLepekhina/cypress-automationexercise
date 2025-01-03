/// <reference types="cypress" />
import Header from './headerPage'

class ProductsPage extends Header {
    getAllProductCards = () => cy.get('div.features_items>div.col-sm-4')
    getConfirmPopUp = () => cy.get('div.modal-content')
    getModalShoppingContinueBtn = () => cy.get('button').contains('Continue Shopping')


    findRandomProductCard() {
        return this.getAllProductCards().then(($cards) => {
            const randomIndex = Math.floor(Math.random() * $cards.length)
            return $cards[randomIndex]           
        })
    }

    hoverAndClickAddToCart(randomCard) {
        cy.wrap(randomCard).trigger('mouseover')
        cy.wrap(randomCard).contains('Add to cart').click()
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

    clickModalShoppingContinueBtn() {
        this.getModalShoppingContinueBtn().click()
        return this
    }
}

export default ProductsPage