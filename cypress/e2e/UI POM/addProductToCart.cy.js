/// <reference types="cypress" />

import Header from "../../pageObjects/headerPage"
import ProductsPage from "../../pageObjects/productsPage"
import CartPage from "../../pageObjects/cartPage"

import genData from '../../fixtures/genData'

const header = new Header()
const productsPage = new ProductsPage()
const cartPage = new CartPage()

describe('adding products to cart by registered user', () => {

    beforeEach(() => {
        let newUser = genData.newUser()

        cy.visit('/')
        cy.newUserSignUp(newUser)
        cy.createAccount(newUser)
    })

    afterEach(() => {
        header.clickDeleteAccountLink()
    })

    it('add product to cart from Products page', () => {
        header.clickProductsLink()
        productsPage.findRandomProductCard().then((randomCard) => {
            cy.log(randomCard)
            productsPage.hoverAndClickAddToCart(randomCard)
            return productsPage.getInfoFromRandomCard(randomCard)
        })
        .then((cardInfo) => {
            productsPage.getConfirmPopUp().should('be.visible')
                .and('include.text', 'Added!')
            productsPage.clickModalShoppingContinueBtn()
                .clickCartLink()
            cartPage.getPrices()
                .invoke('text')
                .should((text) => {
                    expect(text.trim()).to.equal(cardInfo.price)
                })
            cartPage.getDescription()
                .invoke('text')
                .should((text) => {
                    expect(text.trim()).to.equal(cardInfo.description)
                })        
        })
    })
})
