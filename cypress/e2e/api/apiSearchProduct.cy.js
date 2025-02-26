/// <reference types="cypress" />
import { searchProductbyName, includesSearchTermOrSynonyms } from '../../support/utils'
import {ENDPOINTS} from '../../support/endpoints'
import spok from 'cy-spok'

const { searchProduct } = ENDPOINTS.API

const testData = {
    DRESS : ['dress', 'gown'],
    jeans : ['jeans'],
    't shirt' : ['tshirt', 't-shirt', 't shirt', 'polo'],
    saree : ["saree"],
    winter : ['winter'],
    cotton: ['cotton'],
    polo : ['polo'],
    green : ['green', 'olive']
}

describe('200 status code', () => {
    //option 1
    Object.entries(testData).forEach(([searchTerm, synonymsArray]) => {
        const includesSearchTermOrSynonym = (productNameString) =>
            synonymsArray.some((word) =>
                productNameString.toLowerCase().includes(word.toLowerCase())
            )
        it(`fetches searched products - search term ${searchTerm} - option 1`, () => {
            searchProductbyName(searchProduct, searchTerm).then((resp) => {
                    return JSON.parse(resp.body)
                }).then((body) => {
                    body.products.forEach((product) => {
                        cy.wrap(product).should(
                        spok({
                            name: includesSearchTermOrSynonym,
                        })
                    )
                })
            })
        })
    })

    //option 2
    Object.entries(testData).forEach(([searchTerm, synonymsArray]) => {
        it(`fetches searched products - search term ${searchTerm} - option 2`, () => {
            searchProductbyName(searchProduct, searchTerm).then((resp) => {
                    return JSON.parse(resp.body)
                }).then((body) => {
                    body.products.forEach((product) => {
                        cy.wrap(product.name).should((productName) => {
                            expect(includesSearchTermOrSynonyms(productName, synonymsArray)).to.be.true
                        })
                    })
            })
        })    
    })

})