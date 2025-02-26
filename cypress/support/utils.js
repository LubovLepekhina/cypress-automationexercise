// api functions
export function calculateBrandQuantity(products) {
    let eachBrandQuantity = {}
    products.forEach(item => {
        if (eachBrandQuantity[item.brand]) {
            eachBrandQuantity[item.brand] += 1
        } else {
            eachBrandQuantity[item.brand] = 1
        }
    })
    return eachBrandQuantity
}

export function createNewUserApi(endpoint, userdata) {
    return cy.request({
        method: 'POST',
        url: endpoint,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        failOnStatusCode: false,
        body: {
            title: userdata.gender,
            name: userdata.name,
            email: userdata.emailAddress,
            password: userdata.password,
            birth_date: userdata.birthDate.dateOfBirth,
            birth_month: userdata.birthDate.monthOfBirth,
            birth_year: userdata.birthDate.yearOfBirth,
            firstname: userdata.firstName,
            lastname: userdata.lastName,
            company: userdata.company,
            address1: userdata.address,
            address2: userdata.address,
            country: userdata.country,
            zipcode: userdata.zipCode,
            state: userdata.state,
            city: userdata.city,
            mobile_number: userdata.mobileNumber,
        }
    })

}
/**
 * login thru api
 * @param {string} endpoint url endpont to which we make call
 * @param {string} userEmail existing user email address
 * @param {string} userPassword existing user password
 * @returns cypress chainable
 */
export function loginApi(endpoint, userEmail, userPassword) {
    return cy.request({
        method: 'POST',
        url: endpoint,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
            email: userEmail,
            password: userPassword,
        }
    })
}
/**
 * gets the list of all products
 * @param {string} endpoint 
 * @returns cypress chainable
 */
export function getAllProducts(endpoint) {
    return cy.api({
        method: 'GET', 
        url : endpoint
    })
}
/**
 * returns a number of the total quantity of different products in database
 * @param {string} endpoint url to which a request is sent
 * @returns a number representing the total quantity of types of products in database
 */
export function getProductsQuantity(endpoint) {
  return cy.request({
      method: "GET",
      url: endpoint,
    })
    .then((resp) => {
      let respBodyObj = JSON.parse(resp.body);
      let productsQuantity = respBodyObj.products.length;
      return cy.wrap(productsQuantity);
    });
}

/**
 * retrieve all product ids
 * @param {string} endpoint 
 * @returns array of IDs, cypress chainable
 */
export function getAllProductIDs(endpoint) {
  return cy.api({
      method: "GET",
      url: endpoint,
    })
    .then((resp) => {
      let respBodyObj = JSON.parse(resp.body);
      let productIDs = [];
      respBodyObj.products.forEach((product) => {
        productIDs.push(product.id);
      });
      return cy.wrap(productIDs);
    })
}
/**
 * Sends a POST request to search for a product by name
 * @param {string} endpoint The API endpoint URL for product search
 * @param {string} productName The name of the product to search for
 * @returns {Cypress.Chainable} - A Cypress chainable object containing the response of the request
 */
export function searchProductbyName(endpoint, productName) {
    return cy.request({
        method: 'POST', 
        url: endpoint,
        body: {
            search_product: productName
        }, 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        failOnStatusCode: false
    })
}
/**
 * Fetches all product names from the given API endpoint.
 * @param {string} endpoint - The API endpoint URL to retrieve products.
 * @returns {Cypress.Chainable<string[]>} - A Cypress chainable object containing an array of product names.
 */
export function getAllProductName(endpoint) {
    return cy.api({
        method: "GET",
        url: endpoint,
    }).then((resp) => {
        const respBodyObj = JSON.parse(resp.body)
        const allProductNameList = [];
        respBodyObj.products.forEach((product) => {
            allProductNameList.push(product.name)
        })
        return cy.wrap(allProductNameList);
        })
    }

// js helper functions
/**
 * /**
 * Checks whether a product name contains at least one word from a given synonyms array.
 * @param {string} productNameString - The product name to search within.
 * @param {string[]} synonymsArray - An array of search terms and synonyms to match.
 * @returns {boolean} - Returns `true` if the product name includes any word from the synonyms array, otherwise `false`.
 */
export const includesSearchTermOrSynonyms = (productNameString, synonymsArray) =>
    synonymsArray.some((word) =>
        productNameString.toLowerCase().includes(word.toLowerCase())
    )
