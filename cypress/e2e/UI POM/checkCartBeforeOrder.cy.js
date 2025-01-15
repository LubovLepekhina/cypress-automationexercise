/// <reference types="cypress" />

import Header from '../../pageObjects/headerPage'
import ProductsPage from "../../pageObjects/productsPage"
import CartPage from "../../pageObjects/cartPage"
import LoginPage from '../../pageObjects/loginPage'
import genData from '../../fixtures/genData'
import CheckoutPage from '../../pageObjects/checkoutPage'
import { ENDPOINTS } from "../../support/endpoints"

const productsPage = new ProductsPage()
const headerPage = new Header()
const cartPage = new CartPage()
const loginPage = new LoginPage()
const checkoutPage = new CheckoutPage()

describe('check the cart before ordering', () => {

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

    it ('verify the delivery address matches the address at registration', () => {
        productsPage.clickProductsLink()
            .addRandomProductToCart()
        cy.wait('@addedToCart')
        headerPage.clickModalViewCartLink()
        cartPage.clickProceedToCheckoutBtn()

        cy.url().should('contain', 'checkout')
        
        checkoutPage.getDeliveryAddressBox().invoke('text').then((text) => {
            const cleanedText = text.replace(/\s/g, ' ').trim()
            expect(cleanedText).contains(newUser.firstName)
            expect(cleanedText).contains(newUser.lastName)
            expect(cleanedText).contains(newUser.gender)
            expect(cleanedText).contains(newUser.company)
            expect(cleanedText).contains(newUser.address)
            expect(cleanedText).contains(newUser.country)
            expect(cleanedText).contains(newUser.state)
            expect(cleanedText).contains(newUser.city)
            expect(cleanedText).contains(newUser.zipCode)
            expect(cleanedText).contains(newUser.mobileNumber)
        })        
    })
})