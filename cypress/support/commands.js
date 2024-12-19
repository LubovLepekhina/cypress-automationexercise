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