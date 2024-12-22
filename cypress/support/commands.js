// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import LoginPage from '../pageObjects/loginPage'
import HomePage  from '../pageObjects/homePage'
import SignupPage from '../pageObjects/signupPage'

const loginPage = new LoginPage()
const homePage = new HomePage()
const signupPage = new SignupPage()

Cypress.Commands.add('newUserSignUp', (newUser) => {
    homePage
        .clickSighUpLoginLink()
    loginPage
        .typeNewUserName(newUser.name)
        .typeNewUserEmail(newUser.emailAddress)
        .clickSignUpButton()
})

Cypress.Commands.add('createAccount', (newUser) => {
    signupPage 
        .checkRandomTitleRadioButton()
        .verifyNameInput(newUser.name)  
        .verifyEmailInput(newUser.emailAddress)
        .typePassword(newUser.password)
        .selectDateOfBirth(newUser.birthDate.dateOfBirth)
        .selectMonthOfBirth(newUser.birthDate.monthOfBirth)
        .selectYearOfBirth(newUser.birthDate.yearOfBirth)
        .typeFirstName(newUser.firstName)
        .typeLastName(newUser.lastName)
        .typeCompany(newUser.company)
        .typeAddress(newUser.address)
        .selectCountry(newUser.country)
        .typeState(newUser.state)
        .typeCity(newUser.city)
        .typeZipCode(newUser.zipCode)
        .typeMobileNumber(newUser.mobileNumber)
        .clickCreateAccountButton()
})

Cypress.Commands.add('createAccountAPI', (newUser) => {
    function updateCsrfToken() {
        cy.getCookie('csrftoken').then((cookie) => {
            if (cookie) {
                Cypress.env('csrfToken', cookie.value);
                cy.log(`CSRF Token: ${Cypress.env('csrfToken')}`);
            } else {
                cy.log('CSRF Token cookie not found!');
            }
        });
    }

    function getSessionId() {
        cy.getCookie('sessionid').then((cookie) => {
            if (cookie) {
                Cypress.env('sessionid', cookie.value);
                cy.log(`Session ID: ${Cypress.env('sessionid')}`);
            } else {
                cy.log('Session ID cookie not found!');
            }
        });
    }

    function getCSRFmiddlewaretoken(response) {
        const matches = response.body.match(/<input[^>]*name=["']csrfmiddlewaretoken["'][^>]*value=["'](.+?)["']/);
        const csrfmiddlewaretoken = matches ? matches[1] : '';
        Cypress.env('csrfmiddlewaretoken', csrfmiddlewaretoken);
        cy.log(`csrfmiddlewaretoken: ${Cypress.env('csrfmiddlewaretoken')}`);
    }

    cy.request({
        method: 'GET',
        url: '/signup',
    }).then(response => {
        updateCsrfToken(response)
        getCSRFmiddlewaretoken(response)
        cy.request({
            method: 'POST',
            url: '/signup',
            form: true,
            body: {
                csrfmiddlewaretoken: Cypress.env('csrfmiddlewaretoken'),
                name: newUser.name,
                email: newUser.emailAddress,
                form_type:'signup',
            },
            headers: {
                'cookie': `csrftoken=${Cypress.env('csrfToken')};`,
                'referer': 'https://automationexercise.com/login'
            },
            failOnStatusCode: false
        }).then((response) => {
            updateCsrfToken();
            getSessionId();
            getCSRFmiddlewaretoken(response);
            cy.request({
                method: 'POST',
                url: '/signup',
                form: true,
                body: {
                    csrfmiddlewaretoken: Cypress.env('csrfmiddlewaretoken'),
                    title:'Mr',
                    name: newUser.name,
                    email_address: newUser.emailAddress,
                    password: newUser.password,
                    days: newUser.birthDate.dateOfBirth,
                    months: newUser.birthDate.monthOfBirth,
                    years: newUser.birthDate.yearOfBirth,
                    newsletter : 1,
                    optin : 1,
                    first_name: newUser.firstName,
                    last_name: newUser.lastName,
                    company: newUser.company,
                    address1: newUser.address,
                    address2: newUser.address,
                    country: newUser.country,
                    state: newUser.state,
                    city: newUser.city,
                    zipcode: newUser.zipCode,
                    mobile_number: newUser.mobileNumber,
                    form_type:'create_account',
                },
                headers: {
                    'cookie': `csrftoken=${Cypress.env('csrfToken')}; sessionid=${Cypress.env('sessionId')}`,
                    'referer':'https://automationexercise.com/login'
                },
            }).then((response) => {
                updateCsrfToken();
                getSessionId();
                getCSRFmiddlewaretoken(response);
            })
        })
    })
})