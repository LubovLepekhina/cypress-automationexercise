/// <reference types="cypress" />
import spok from 'cy-spok'
chai.use(require('chai-json-schema'))
import { faker } from "@faker-js/faker"
import genData from '../../fixtures/genData'
import messages from '../../fixtures/api/messages.json'
import errorMessages from '../../fixtures/api/errorMessages.json'
import schemas from '../../fixtures/api/schemas.json'
import { createNewUserApi } from '../../support/utils'
import { loginApi } from '../../support/utils'
import { ENDPOINTS } from '../../support/endpoints'

let newUser

before(() => {
    cy.log('generate user data')
    newUser = genData.newUser()
    cy.log('create user account')
    createNewUserApi(ENDPOINTS.API.createAccount, newUser)
})

after(() => {
    cy.apiDeleteUserAccount(newUser.emailAddress, newUser.password)
})

describe('login', () => {
    it('succesfully log in', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password).then(resp => {
            expect(resp.status).to.eq(200)
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 200,
            message : messages.login[0]
        }))
    })

    it('checks schema succesfully log in', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password).then(resp => {
            expect(JSON.parse(resp.body)).to.be.jsonSchema(schemas.succesfullLogIn) 
        })
    })

    it('errors when log in with wrong credentials', () => {
        newUser.emailAddress = faker.internet.email()
        newUser.password = faker.internet.password()
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password).then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 404,
            message : errorMessages.logIn[0]
        }))
    })

    it('errors when log in without password', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password = '').then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 404,
            message : errorMessages.logIn[0]
        }))
    })

    it('checks schema 404 error when log in without password', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password = '').then(resp => {
            expect(JSON.parse(resp.body)).to.be.jsonSchema(schemas.unsuccesfullLogIn) 
        })
    })

    it('errors when log in without email', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress = '', newUser.password).then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 404,
            message : errorMessages.logIn[0]
        }))
    })

    it('checks schema 404 error when log in without email', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password = '').then(resp => {
            expect(JSON.parse(resp.body)).to.be.jsonSchema(schemas.unsuccesfullLogIn) 
        })
    })

    it('errors when log in without providing credentials', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress = '', newUser.password = '').then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 404,
            message : errorMessages.logIn[0]
        }))
    })

    it('checks schema 404 error when log in without providing credentials', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password = '').then(resp => {
            expect(JSON.parse(resp.body)).to.be.jsonSchema(schemas.unsuccesfullLogIn) 
        })
    })

    it('errors when log in with wrong datatypes credentials', () => {
        newUser.emailAddress = [newUser.emailAddress]
        newUser.password = [newUser.password]
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password).then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 400,
            message : errorMessages.logIn[1]
        }))
    })

    it('errors when log in with wrong datatype password', () => {
        newUser.password = [newUser.password]
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password).then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 400,
            message : errorMessages.logIn[1]
        }))
    })

    it('errors when log in with wrong datatype email', () => {
        newUser.emailAddress = [newUser.emailAddress]
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password).then(resp => {
            return JSON.parse(resp.body)
        }).should(spok({
            responseCode: 400,
            message : errorMessages.logIn[1]
        }))
    })

    it('checks schema 400 error when log in with wrong datatypes ', () => {
        loginApi(ENDPOINTS.API.login, newUser.emailAddress, newUser.password = '').then(resp => {
            expect(JSON.parse(resp.body)).to.be.jsonSchema(schemas.unsuccesfullLogIn) 
        })
    })

})    
