import { faker } from "@faker-js/faker";

module.exports = {
    newUser: function () {
        let NewUser = {
            gender: faker.helpers.arrayElement(['Mr', 'Mrs']),
            name: faker.person.firstName(),
            emailAddress: faker.internet.email({firstName: faker.person.firstName()}),
            password: faker.internet.password(),
            birthDate: {
                dateOfBirth : Cypress._.random(1,31),
                monthOfBirth : Cypress._.random(1,12),
                yearOfBirth : Cypress._.random(0,121)
            },
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            company: faker.company.buzzNoun() ,
            address: faker.location.streetAddress(),
            country: Cypress._.random(0,6),
            state: faker.location.state(),
            city: faker.location.city(),
            zipCode: faker.location.zipCode('####'),
            mobileNumber: faker.number.int(),
        };
        return NewUser;
    },

    creditCard: {
        cardHolder: faker.person.fullName(),
        cardNumber: faker.finance.creditCardNumber(),
        cvc: faker.finance.creditCardCVV(),
        expiryData: function() {
            const fullExpiryData = faker.date.future({years: 5})
            return {
                expiryMonth: fullExpiryData.getMonth() + 1,
                expiryYear: fullExpiryData.getFullYear()
            }
        }  
    }
}
