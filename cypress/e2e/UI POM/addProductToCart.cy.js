/// <reference types="cypress" />

import Header from "../../pageObjects/headerPage"
import ProductsPage from "../../pageObjects/productsPage"
import CartPage from "../../pageObjects/cartPage"
import AccountCreatedPage from "../../pageObjects/accountCreatedPage"
import HomePage from "../../pageObjects/homePage"
import ProductDetailsPage from "../../pageObjects/productDetailsPage"

import genData from '../../fixtures/genData'
import { ENDPOINTS } from "../../support/endpoints"

const header = new Header()
const productsPage = new ProductsPage()
const cartPage = new CartPage()
const accountCreatedPage = new AccountCreatedPage()
const homePage = new HomePage()
const productDetailsPage = new ProductDetailsPage()

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
        cartPage.retrieveDataFromCartTable().as('initialData')

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

    it('redirects to the product page when clicking on a product from the cart', () => {
        cy.intercept({
            method: 'GET',
            url: `/${ENDPOINTS.API.addToCart}/*`
        }).as('addedToCart')
        accountCreatedPage.clickContinueButton()
        homePage.generateRandomIndexProductCard().then(index => {
            homePage.retrieveInfoFromProductCard(index).as('cardInfo')
            homePage.addProductToCart(index)
            cy.log('add a dynamic waiter to ensure product is added to the card and modal pop up is visible')
            cy.wait('@addedToCart')    
            homePage.clickModalViewCartLink()
        })
        cy.get('@cardInfo').then((cardInfo) => {
            cartPage.verifyCartTableProductName(cardInfo.description)
            cartPage.verifyCartTableProductPrice(cardInfo.description, cardInfo.price)

            cartPage.retrieveProductPageLink(cardInfo.description).as('endpoint')
            cartPage.clickProductDescriptionLinkFromCartTable(cardInfo.description)
            
            cy.log('verify product name')
            productDetailsPage.getNameProductInformation().should('have.text', cardInfo.description)
            
            cy.log('verify product price')
            productDetailsPage.getPriceProductInformation().should('have.text', cardInfo.price)
            
            cy.log('verify product image')
            productDetailsPage.getProductImage().invoke('attr', 'src').then(productImage => {
                expect(productImage).to.eq(cardInfo.imageLink)
            })
            productDetailsPage.getProductImage().then(($img) => {
                expect($img).to.have.prop('naturalWidth').greaterThan(0)
                expect($img).to.have.prop('naturalHeight').greaterThan(0)
            })
        })
        //cy.log('verify url')
        cy.get('@endpoint').then((endpoint) => {
            cy.url().should('contain', endpoint)
        })
    })

})
