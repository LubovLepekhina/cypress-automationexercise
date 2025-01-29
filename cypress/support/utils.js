
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
