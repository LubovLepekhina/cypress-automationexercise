/// <reference types="cypress" />
import Header from "../../pageObjects/headerPage"
import ProductsPage from "../../pageObjects/productsPage"
import { getProductsQuantity } from '../../support/utils'
import { ENDPOINTS } from '../../support/endpoints'

const header = new Header()
const productsPage = new ProductsPage()

beforeEach('visit base URL', () => {
    cy.visit('/')
    getProductsQuantity(ENDPOINTS.API.getAllProductsList).as('quantityFromDatabase')
})

describe('Products', () => {
    it('dislays all products', () => {
        header.clickProductsLink()
        productsPage.getAllProductCards().then(function ($cards) {
            expect($cards.length).to.eq(this.quantityFromDatabase)
        })
    })
})