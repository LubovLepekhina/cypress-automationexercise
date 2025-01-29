import { getAllProducts } from '../../support/utils'
import {ENDPOINTS} from '../../support/endpoints'
import spok from 'cy-spok'
import { allProducts } from '../../fixtures/api/schemas.json'
chai.use(require('chai-json-schema'))

describe('Product list', () => {
    it('returns 200 status code', () => {
        getAllProducts(ENDPOINTS.API.getAllProductsList).its('status').should('eq', 200)
    })

    it('verify response body', () => {
        getAllProducts(ENDPOINTS.API.getAllProductsList).then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode : 200, 
            products:  spok.array
        }))
    })

    it.only('verify json schema', () => {
        getAllProducts(ENDPOINTS.API.getAllProductsList).then(resp => {
            //cy.log(JSON.parse(resp.body))
            expect(JSON.parse(resp.body)).to.be.jsonSchema(allProducts)
        })
    })
})