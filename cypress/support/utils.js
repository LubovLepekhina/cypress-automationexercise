
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