/// <reference types="cypress" />

import Header from "../../pageObjects/headerPage"
import ProductsPage from "../../pageObjects/productsPage"
import CartPage from "../../pageObjects/cartPage"
import LoginPage from '../../pageObjects/loginPage'
import CheckoutPage from "../../pageObjects/checkoutPage"
import PaymentPage from "../../pageObjects/paymentPage"
import PaymentDonePage from '../../pageObjects/paymentDonePage'
import genData from '../../fixtures/genData'
import { ENDPOINTS } from "../../support/endpoints"

const headerPage = new Header()
const productsPage = new ProductsPage()
const cartPage = new CartPage()
const loginPage = new LoginPage()
const checkoutPage = new CheckoutPage()
const paymentPage = new PaymentPage()
const paymentDonePage = new PaymentDonePage()

describe('downloading invoice', () => {
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

    it ('downloaded invoice contains user first name and last name', () => {
        productsPage.clickProductsLink()
                .addRandomProductToCart()
        cy.wait('@addedToCart')
        headerPage.clickModalViewCartLink()
        cartPage.clickProceedToCheckoutBtn()

        cy.url().should('contain', ENDPOINTS.UI.CHECKOUT)

        checkoutPage.clickPlaceOrderLink()

        cy.url().should('contain', ENDPOINTS.UI.PAYMENT)

        paymentPage.fillCardInformation(genData.creditCard)
            .clickPayAndConfirmOrderButton()

        cy.url().should('contain', ENDPOINTS.UI.SUCCESSFULLPAYMENT)
        paymentDonePage.clickDownloadInvoiceLink()

        const filePath = 'cypress/downloads/invoice.txt'
        cy.readFile(filePath).should('contain', newUser.firstName)
            .and('contain', newUser.lastName)
       
    })
})