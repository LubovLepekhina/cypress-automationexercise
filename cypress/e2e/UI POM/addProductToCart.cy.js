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

    it('updates cart when adding the same product', () => {
        header.clickProductsLink()
        
        cy.log('generate random index')
        productsPage.generateRandomIndexProductCard().as('index')

        cy.log('add a product to cart by index')
        cy.get('@index').then((index) => {
            productsPage.chooseProductCardByIndex(index).then((card) => {
                productsPage.getInfoFromRandomCard(card).then(info => cy.wrap(info).as('cardInfo'))
            })
            //productsPage.retrieveInfoFromProductCard(index).as('cardInfo')
            productsPage.addProductToCart(index)
        })
        
        productsPage.clickModalViewCartLink()

        cy.log('verify product name and price in the cart')
        cy.get('@cardInfo').then(cardInfo => {
            cartPage.verifyCartTableProductName(cardInfo.description)
            cartPage.verifyCartTableProductPrice(cardInfo.description, cardInfo.price)
        })
        
        cy.log('retrieve initial data from cart table')
        cartPage.retrieveDataFromCartTable().then(tabledata => {
            return tabledata
        }).as('initialData')

        header.clickProductsLink()
        
        cy.log('add the same product') 
        cy.get('@index').then((index) => {
            productsPage.addProductToCart(index)
        })

        productsPage.clickModalViewCartLink()
        
        cy.log('verify updated data in the cart table')
        cy.get('@initialData').then((initialData) => {
            cartPage.retrieveDataFromCartTable().then(tabledata => {
                
                cy.log('verify quantity')
                let actualQuantity = tabledata[0].Quantity
                let expectedQuantity = initialData[0].Quantity + 1
                expect(actualQuantity).to.eq(expectedQuantity)
                
                cy.log('verify total')
                let actualTotal = tabledata[0].Total
                let expectedTotal = initialData[0].Total * expectedQuantity
                expect(actualTotal).to.eq(expectedTotal)
            })
        })
        cy.get('@cardInfo').then(card => {
            cartPage.retrieveDataFromCartTable().then(tabledata => {
                
                cy.log('verify product name')
                expect(tabledata[0].Description).to.contain(card.description)
                
                cy.log('verify product price')
                expect(String(tabledata[0].Price)).to.contain(card.price.slice(3).trim())
            })
        })
    })

})
