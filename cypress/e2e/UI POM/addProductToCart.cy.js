/// <reference types="cypress" />

import Header from "../../pageObjects/headerPage"
import ProductsPage from "../../pageObjects/productsPage"
import CartPage from "../../pageObjects/cartPage"
import LoginPage from '../../pageObjects/loginPage'
import HomePage from "../../pageObjects/homePage"
import ProductDetailsPage from "../../pageObjects/productDetailsPage"
import genData from '../../fixtures/genData'
import { ENDPOINTS } from "../../support/endpoints"

const header = new Header()
const productsPage = new ProductsPage()
const cartPage = new CartPage()
const loginPage = new LoginPage()
const homePage = new HomePage()
const productDetailsPage = new ProductDetailsPage()

let newUser

describe('Cart | Logged-in user adds products', () => {
    before(()=> {
        newUser = genData.newUser()
        cy.apiCreateUserAccount(newUser)
    })

    beforeEach(() => {
        cy.loginSession(newUser)

        cy.intercept({
            method: 'GET',
            url: `/${ENDPOINTS.API.addToCart}/*`
        }).as('addedToCart')    
    })

    after(() => {
        cy.apiDeleteUserAccount(newUser.emailAddress, newUser.password)
    })

    it('add product to cart from Products page', () => {
        cy.visit('/')
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
        cy.visit('/')
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
        cy.visit('/')
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
        cy.log('verify url')
        cy.get('@endpoint').then((endpoint) => {
            cy.url().should('contain', endpoint)
        })
    })

    it('add two products to cart from the product details page', () => {
        cy.visit('/')
        productsPage.clickProductsLink()
            .clickRandomViewProductLink()
        
        productDetailsPage.verifyDefaultQuantity()
            .clickUpArrowQuantity()
            .getQuantityInput().should('have.value', '2')
        
        productDetailsPage.getProductInfo().as('productInfo')
        productDetailsPage.clickAddToCartBtn()
            .getConfirmPopUp().should('be.visible')
                .and('include.text', 'Added!')
        productDetailsPage.clickModalViewCartLink()
        cy.url().should('contain', ENDPOINTS.UI.CART)

        cartPage.retrieveDataFromCartTable().then((data) => {
            cy.get('@productInfo').then((productInfo) => {
                cy.log(productInfo.total)
                expect(data[0].Description).to.contains(productInfo.productName)
                expect(data[0].Description).to.contains(productInfo.productCategory)
                expect(String(data[0].Price)).to.eq(productInfo.productPrice)
                expect(String(data[0].Quantity)).to.eq(productInfo.productQuantity)
                expect(String(data[0].Total)).to.eq(productInfo.total)
            })  
        })
    })
  
    it('adds multiple quantity of the same product from the product details page', () => {
        cy.visit('/')
        let quantityToBuy = Cypress._.random(1,25)
        cy.log(`Quantity To Buy ${quantityToBuy}`)
        productsPage.clickProductsLink()
        .generateRandomIndexProductCard().then((index) => {
            productsPage.chooseProductCardByIndex(index)
        }).within(() => productsPage.getViewProductLink().click())
        productDetailsPage.clickUpperArrowMultipleTimes(quantityToBuy)
        productDetailsPage.getProductInfo().as('productDetails')
        productDetailsPage.clickAddToCartBtn()
        cy.wait('@addedToCart')
        productDetailsPage.clickModalViewCartLink()
        cartPage.retrieveDataFromCartTable().then(cartData => {
            cy.log('verify product details and quantity')
            expect(cartData[0].Quantity).to.eq(quantityToBuy)
            cy.get('@productDetails').then(info => {
                expect(cartData[0].Description).to.contains(info.productName)
                expect(cartData[0].Description).to.contains(info.productCategory)
                expect(String(cartData[0].Price)).to.eq(info.productPrice)
                expect(String(cartData[0].Quantity)).to.eq(info.productQuantity)
                expect(String(cartData[0].Total)).to.eq(info.total)
            })
        })
        
    })

})

describe('Cart | Unregistered user adds products', () => {

})

describe('Cart | Registered user ( but not logged in) adds products', () => {
    before(()=> {
        newUser = genData.newUser()
        cy.apiCreateUserAccount(newUser)
    })

    after(() => {
        cy.apiDeleteUserAccount(newUser.emailAddress, newUser.password)
    })

    it('The added item will be saved if you add it before authorisation', () => {
        cy.visit('/')
        header
            .clickProductsLink()
        productsPage
            .addProductToCart(1)
        header
            .clickModalViewCartLink()
        cartPage
            .clickProceedToCheckoutBtn()
        header
            .clickLoginMsgBtn()
        loginPage
            .typeLoginUserEmail(newUser.emailAddress)
            .typeLoginUserPassword(newUser.password)
            .clickLoginButton()
        header
            .clickCartLink()
        cartPage
            .getCartTableRows().should('be.visible');
    })

})
