import validateSchema from 'cypress-ajv-schema-validator'
chai.use(require('chai-json-schema'))
import spok from 'cy-spok'
import { faker } from "@faker-js/faker"

import genData from '../../fixtures/genData'
import schemas from '../../fixtures/api/schemas.json'
import errorMessage from '../../fixtures/api/errorMessages.json'

import { createNewUserApi } from '../../support/utils'
import {ENDPOINTS} from '../../support/endpoints'

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

    it('errors when creating a user with existing data set', () => {
        cy.log('precondition')
        createNewUserApi(ENDPOINTS.API.createAccount, newUser).its('status').should('eq', 200)
        cy.log('create user with the same data set')
        createNewUserApi(ENDPOINTS.API.createAccount, newUser).then(resp => {
            expect(resp.status).to.equal(200)
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 400,
            message: errorMessage.createNewUser[0]
            }))
    })
    
    it('checks json schema creating a user with existing data set', () => {
        cy.log('precondition')
        createNewUserApi(ENDPOINTS.API.createAccount, newUser).its('status').should('eq', 200)
        cy.log('create user with the same data set')
        createNewUserApi(ENDPOINTS.API.createAccount, newUser).then(resp => {
            expect(JSON.parse(resp.body)).to.be.jsonSchema(schemas.emailExist)
        })
    })

})