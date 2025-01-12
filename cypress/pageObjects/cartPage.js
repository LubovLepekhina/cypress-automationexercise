/// <reference types="cypress" />

import Header from './headerPage'

class CartPage extends Header {

    getPrices = () => cy.get('td.cart_price')
    getDescription = () => cy.get('a[href*="/product_details/"]')
    getCartTableHeader = () => cy.get('#cart_info_table thead td')
    getCartTableRows = () => cy.get('#cart_info_table tbody tr')
    getProductbyDescription = (productDescription) => cy.contains('#cart_info_table tbody tr', productDescription)
    getProceedToCheckoutBtn = () => cy.get('a.btn.btn-default.check_out')
    getProductDeleteLink = () => cy.get('.cart_quantity_delete')

    retrieveDataFromCartTable() {
        let tableData = []
        let headerTable
        this.getCartTableHeader().then(($tds) => {
            headerTable = Cypress.$.makeArray($tds).map(el => el.innerText)
        })
        this.getCartTableRows().each(row => {
            cy.wrap(row).find('td').then(($tds) => {
                let rowData = Cypress.$.makeArray($tds).map(el => el.innerText)
                let rowObj = Cypress._.zipObject(headerTable, rowData)
                for (let prop in rowObj) {
                    if( prop == 'Total') rowObj[prop] = Number(rowObj[prop].slice(3).trim())
                    else if( prop == 'Quantity') rowObj[prop] = Number(rowObj[prop])
                    else if( prop == 'Price') rowObj[prop] = Number(rowObj[prop].slice(3).trim())
                  }
                tableData.push(rowObj)
            })
        })
        return  cy.wrap(tableData)
    }

    verifyCartTableProductName(productDescription) {
        this.getProductbyDescription(productDescription).should('be.visible')
        return this
    }

    verifyCartTableProductPrice(productDescription, productPrice) {
        this.getProductbyDescription(productDescription).find('td.cart_price')
            .should('be.visible')
            .invoke('text').then(($text) => {
                expect($text.trim()).to.eq(productPrice)
            })
        return this
    }

    clickProductDescriptionLinkFromCartTable(productName) {
        this.getDescription().contains(productName).click()
        return this
    }

    retrieveProductPageLink(productName) {
        return this.getDescription().contains(productName)
            .invoke('attr', 'href')
            .then(link => {
                return link
        })
    }

    clickProceedToCheckoutBtn() {
        this.getProceedToCheckoutBtn().click()
        return this
    }

    getCartTableRowByProductName(productName) {
        return this.getCartTableRows()
            .contains(productName)
            .parents('tr')
    }

    clickProductDeleteLink(productName) {
        return this.getCartTableRowByProductName(productName)
            .within(() => this.getProductDeleteLink().click())
    }

    getRandomProductName() {
        let descArray = []
        return this.getDescription().each(($els) => {
            descArray.push($els.text())
        }).then(() => Cypress._.sample(descArray))
    }

    //не использовала, может пригодиться позже
    getProductIdByProductName(productName) {
        this.getCartTableRows()
            .contains(productName)
            .closest('tr')
            .invoke('attr', 'id')
            .then((id) => {
                return id.slice(8)
            })
    }

}

export default CartPage