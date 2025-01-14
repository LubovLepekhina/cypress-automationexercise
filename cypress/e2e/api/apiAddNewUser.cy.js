import validateSchema from 'cypress-ajv-schema-validator'
chai.use(require('chai-json-schema'))
import spok from 'cy-spok'

import genData from '../../fixtures/genData'
import schemas from '../../fixtures/api/schemas.json'

describe('create new user', () => {

    let newUser
    beforeEach(() => {
        newUser = genData.newUser()
    })
    afterEach(() => {
        cy.apiDeleteUserAccount(newUser.emailAddress, newUser.password)
    })

    it('checks json schema for creating user', () => {
        
        cy.apiCreateUserAccount(newUser).then((response) => {
            expect(JSON.parse(response.body)).to.be.jsonSchema(schemas.createUser)
        })
    })

    it('checks status code and response body for creating user', () => {
        
        cy.apiCreateUserAccount(newUser).then((response) => {
            expect(response.status).to.equal(200)
            return JSON.parse(response.body)
        }).should(spok({
            message: "User created!",
            responseCode: 201
        }))
    })

})