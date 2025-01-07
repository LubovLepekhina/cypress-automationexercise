/// <reference types="cypress" />

import LoginPage from '../../pageObjects/loginPage'
import HomePage  from '../../pageObjects/homePage'
import SignupPage from '../../pageObjects/signupPage'
import AccountCreatedPage from '../../pageObjects/accountCreatedPage'
import Header from '../../pageObjects/headerPage'

import genData from '../../fixtures/genData'
import accountCreatedData from '../../fixtures/accountCreatedPageData.json'
import headerData from '../../fixtures/headerData.json'
import {signupPageErrorData} from '../../fixtures/errorData.json'
import {accountInformation} from '../../fixtures/signupPageData.json'
import {signupForm} from '../../fixtures/signupPageData.json'
import loginPageData from '../../fixtures/loginPageData.json'

const loginPage = new LoginPage()
const homePage = new HomePage()
const signupPage = new SignupPage()
const accountCreatedPage = new AccountCreatedPage()
const header = new Header()

beforeEach('visit base URL', () => {
    cy.visit('/')
})

describe('register a new user', () => {
    it('creates a new user', () => {
        let newUser = genData.newUser()
        
        homePage
           .clickSighUpLoginLink()
        loginPage
           .getHeadingNewUserSignUp()
                .should('have.text', loginPageData.signupForm.headerText)  
                .and('have.css', 'color', loginPageData.signupForm.cssColor) 
        loginPage
           .typeNewUserName(newUser.name)
           .typeNewUserEmail(newUser.emailAddress)
           .clickSignUpButton()
        signupPage
           .getHeadingLoginForm()
                .should('have.text', signupForm.heading_1.text) 
                .and('have.css', 'color', signupForm.heading_1.cssColor)
        signupPage
            .checkRandomTitleRadioButton()
            .verifyNameInput(newUser.name)
            .verifyEmailInput(newUser.emailAddress)
            .typePassword(newUser.password)
            .selectDateOfBirth(newUser.birthDate.dateOfBirth)
            .selectMonthOfBirth(newUser.birthDate.monthOfBirth)
            .selectYearOfBirth(newUser.birthDate.yearOfBirth)
            .getHeadingAddressInformation()
                .should('have.text', signupForm.heading_2.text) 
                .and('have.css', 'color', signupForm.heading_2.cssColor)
        signupPage
            .clickNewsletterCheckbox()
            .clickSpecialOfferCheckbox()
            .typeFirstName(newUser.firstName)
            .typeLastName(newUser.lastName)
            .typeCompany(newUser.company)
            .typeAddress(newUser.address)
            .selectCountry(newUser.country)
            .typeState(newUser.state)
            .typeCity(newUser.city)
            .typeZipCode(newUser.zipCode)
            .typeMobileNumber(newUser.mobileNumber)
            .clickCreateAccountButton();   
        accountCreatedPage
            .getHeader().should('contain', accountCreatedData.pageText.header)
        accountCreatedPage
            .getPageTextLine1().should('contain', accountCreatedData.pageText.text_1)
        accountCreatedPage
            .getPageTextLine2().should('contain', accountCreatedData.pageText.text_2)
        accountCreatedPage.clickContinueButton()
        header
            .getLoggedinAs().should('contain', headerData.navbarItems.registeredUser.slice(-1) + `${newUser.name}`)
        
        cy.log('delete an account')
        header.clickDeleteAccountLink()
    })

    it('register User with existing email', () => {
        let newUser = genData.newUser()
        
        cy.log('preconditions')
        cy.newUserSignUp(newUser)
        cy.createAccount(newUser)
        accountCreatedPage.getHeader().should('contain', accountCreatedData.pageText.header)
        accountCreatedPage.clickContinueButton()
        cy.contains('a', `Logged in as ${newUser.name}`).should('be.visible')
        header.clickLogOutLink()

        cy.log('body')
        cy.newUserSignUp(newUser)        
        cy.contains('p', signupPageErrorData.errorText).should('be.visible')
           .and('have.css', 'color', signupPageErrorData.cssColor)

    })

    it('Create new user via API POST request', () => {
        let newUser = genData.newUser()
        cy.createAccountWithCSRF(newUser)
        cy.visit('/').log('delete an account')
        header.clickDeleteAccountLink()
    })

    accountInformation.inputsList.forEach(inputName => {
        it(`The entered text is displayed correctly in the ${inputName} field`, () => {
            let newUser = genData.newUser()
            let methodName = `get${inputName}Input`
            let genDataKey = inputName[0].toLowerCase() + inputName.slice(1)

            cy.newUserSignUp(newUser)
            
            signupPage[methodName]().type(newUser[genDataKey])
                .should('have.value', newUser[genDataKey])
        })
    })

    accountInformation.title.forEach((title, idx) => {
        it(`checks ${title} radio button`, () => {
            let newUser = genData.newUser()
            cy.newUserSignUp(newUser)
            signupPage.getTitleRadioButtons().eq(idx)
                .should('be.visible')
                .and('not.be.checked')
                .check()
                .should('be.checked')
        })
    })

    accountInformation.title.forEach((title, idx) => {
        it(`verify ${title} radio button label text`, () => {
            let newUser = genData.newUser()
            cy.newUserSignUp(newUser)
            signupPage.getLabelTitleRadioButtons().eq(idx)
                .should('be.visible')
                .invoke('text').then(($text) => {
                    expect($text.trim()).to.eq(title)
                })
        })
    })

    it('Mrs. radio button should be unchecked if Mr. is checked and vv', () => {
        let newUser = genData.newUser()
            cy.newUserSignUp(newUser)
            signupPage.getTitleRadioButtons().should('not.be.checked')
            signupPage.getTitleRadioButtons().eq(0).should('not.be.checked').check().should('be.checked')
            signupPage.getTitleRadioButtons().eq(1).should('not.be.checked').check().should('be.checked')
            signupPage.getTitleRadioButtons().eq(0).should('not.be.checked')
    })

    it('checks newsletter check box', () => {
        let newUser = genData.newUser()
        cy.newUserSignUp(newUser)
        signupPage.getCheckboxNewsletter()
            .should('be.visible')
            .and('not.be.checked')
            .check()
            .should('be.checked')
            .uncheck()
            .should('not.be.checked')
    })

    it('verify newsletter check box label text', () => {
        let newUser = genData.newUser()
        cy.newUserSignUp(newUser)
        signupPage.getCheckboxNewsletterLabel()
            .should('be.visible')
            .invoke('text')
            .should('eq', accountInformation.checkboxLabel.newsletter)
    })

    it('checks special offer check box', () => {
        let newUser = genData.newUser()
        cy.newUserSignUp(newUser)
        signupPage.getSpecialOfferCheckbox()
            .should('be.visible')
            .and('not.be.checked')
            .check()
            .should('be.checked')
            .uncheck()
            .should('not.be.checked')
    })

    it('verify special offer check box label text', () => {
        let newUser = genData.newUser()
        cy.newUserSignUp(newUser)
        signupPage.getSpecialOfferCheckboxLabel()
            .should('be.visible')
            .invoke('text')
            .should('eq', accountInformation.checkboxLabel.specialOffer)
    })

    it('Checking that the browser sends an error message', ()=> {
        let newUser = genData.newUser();
        header
            .clickSighUpLoginLink();
        loginPage
            .typeNewUserName(newUser.name)
            .typeNewUserEmail(`${newUser.name}@`);
        loginPage
            .getNewUserSignupEmailAddressInput()
            .invoke("attr", "required")
            .should('exist');
        loginPage
            .getNewUserSignupEmailAddressInput()
            .invoke("prop", "validationMessage")
            .should("include", `${newUser.name}@`); 
   });

    it('Check if the selected date is displayed in the “Date of birth” field during registration', ()=> {
        let newUser = genData.newUser();
        header
            .clickSighUpLoginLink();
        loginPage
            .typeNewUserName(newUser.name)
            .typeNewUserEmail(newUser.emailAddress)
            .clickSignUpButton();
        signupPage
            .getDateBirthSelected().should('have.text', 'Day');

        signupPage
            .getDateBirthOptions()
            .each(($el) => {
                const value = $el.attr('value');
                if (value) {
                    signupPage
                        .selectDateOfBirth(value)
                        .getDateBirthSelected()
                        .should('have.text', value)
                        .and('have.value', value);
                };
            });
    });

    it('Check if the selected month is displayed in the “Date of birth” field during registration', ()=> {
        let newUser = genData.newUser();
        header
            .clickSighUpLoginLink();
        loginPage
            .typeNewUserName(newUser.name)
            .typeNewUserEmail(newUser.emailAddress)
            .clickSignUpButton();
        signupPage
            .getMonthBirthSelected().should('have.text', 'Month');

        signupPage
            .getMonthBirthOptions()
            .each(($el) => {
                const value = $el.attr('value');
                if (value) {
                    signupPage
                        .selectMonthOfBirth(value)
                        .getMonthBirthSelected()
                        .should('have.text', accountInformation.monthOfBirth[value-1])
                        .and('have.value', value);
                };
            });
    });

    it('Check if the selected year is displayed in the “Date of birth” field during registration', ()=> {
        let newUser = genData.newUser();
        header
            .clickSighUpLoginLink();
        loginPage
            .typeNewUserName(newUser.name)
            .typeNewUserEmail(newUser.emailAddress)
            .clickSignUpButton();
        signupPage
            .getYearBirthSelected().should('have.text', 'Year');

        signupPage
            .getYearBirthOptions()
            .each(($el) => {
                const value = $el.attr('value');
                if (value === '2019') return false; // Since this is a learning project to reduce time I have limited the validation to disable the restriction, comment out or remove this line
                if (value) {
                    signupPage
                        .selectYearOfBirth(value)
                        .getYearBirthSelected()
                        .should('have.text', value)
                        .and('have.value', value);
                };
            });
    });

    it('Check if the selected country is displayed in the “Country” field during registration', ()=> {
        let newUser = genData.newUser()
        header
            .clickSighUpLoginLink()
        loginPage
            .typeNewUserName(newUser.name)
            .typeNewUserEmail(newUser.emailAddress)
            .clickSignUpButton()
        signupPage
            .getCountrySelected().should('have.text', 'India')

        signupPage
            .getCountryOptions()
            .each(($el) => {
                const value = $el.attr('value');
                if (value) {
                    signupPage
                        .selectCountry(value)
                        .getCountrySelected()
                        .should('have.text', value)
                        .and('have.value', value);
                }
            });
    })
})