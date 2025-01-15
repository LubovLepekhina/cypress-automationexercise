/// <reference types="cypress" />

import ProductsPage from "../../pageObjects/productsPage"
import CartPage from "../../pageObjects/cartPage"
import LoginPage from '../../pageObjects/loginPage'
import ProductDetailsPage from "../../pageObjects/productDetailsPage"
import genData from '../../fixtures/genData'
import { ENDPOINTS } from "../../support/endpoints"

const productsPage = new ProductsPage()
const cartPage = new CartPage()
const loginPage = new LoginPage()
const productDetailsPage = new ProductDetailsPage()

describe('deleting products from cart', () => {

    let newUser
    beforeEach(() => {
        newUser = genData.newUser()
        cy.apiCreateUserAccount(newUser)

        cy.visit('/login')
        loginPage
            .typeLoginUserEmail(newUser.emailAddress)
            .typeLoginUserPassword(newUser.password)
            .clickLoginButton()

        cy.intercept({
            method: 'GET',
            url: `/${ENDPOINTS.API.addToCart}/*`
        }).as('addedToCart')
    })
    afterEach(() => {
        cy.apiDeleteUserAccount(newUser.emailAddress, newUser.password)
    })

    it('delete one of several products from the cart', () => {
        
        let randomNum = Cypress._.random(2, 6)
        cy.log(`${randomNum} products will be added to the cart`)
        for (let i = 1; i <= randomNum; i++) {
            productsPage.clickProductsLink()
                .clickRandomViewProductLink()

            productDetailsPage.clickAddToCartBtn()
            cy.wait('@addedToCart')
            productDetailsPage.clickModalShoppingContinueBtn()
        }

        productDetailsPage.clickCartLink()
        cy.url().should('contain', ENDPOINTS.UI.CART)
        cartPage.getCartTableRows().should('have.length', randomNum)

        cartPage.getRandomProductName().then((productName) => {
            cy.log(`Deleting product: ${productName}`)
            cartPage.clickProductDeleteLink(productName).then(() => {
                cartPage.getCartTableRows().should('not.contain', productName)
                    .and('have.length', randomNum - 1)
            })        
        })
    })

})