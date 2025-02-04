import { getAllProducts } from '../../support/utils'
import {ENDPOINTS} from '../../support/endpoints'
import spok from 'cy-spok'
import schemas from '../../fixtures/api/schemas.json'
import errorMessages from '../../fixtures/api/errorMessages.json'
chai.use(require('chai-json-schema'))

const {status_200, status_405} = schemas.allProducts

describe('200 status code', () => {
    it('fetches all products with 200 status', () => {
        getAllProducts(ENDPOINTS.API.getAllProductsList).its('status').should('eq', 200)
    })

    it('verify response body ', () => {
        getAllProducts(ENDPOINTS.API.getAllProductsList).then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode : 200, 
            products:  spok.array
        }))
    })

    it('verify json schema', () => {
        getAllProducts(ENDPOINTS.API.getAllProductsList).then(resp => {
            expect(JSON.parse(resp.body)).to.be.jsonSchema(status_200)
        })
    })
})

describe('405 status code', () => {
    it('errors when POST method is used', () => {
        cy.api({
            method: 'POST', 
            url : ENDPOINTS.API.getAllProductsList
        }).then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 405,
            message: errorMessages.allProducts[0]
        }))
    })

    it('verify json schema', () => {
        cy.api({
            method: 'POST', 
            url : ENDPOINTS.API.getAllProductsList
        }).then(resp => {
            expect(JSON.parse(resp.body)).to.be.jsonSchema(status_405)
        })
    })
})