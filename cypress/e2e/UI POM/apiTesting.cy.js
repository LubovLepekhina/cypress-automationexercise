/// <reference types="cypress" />

describe('using API', () => {
    const endpointsApi = {
        getAllProductsList: 'api/productsList',
        getAllBrandsList: 'api/brandsList'
    }
    function getData(endpoint) {
        return cy.request({
            method: 'GET',
            url: '/' + endpoint
        })
    }
    function calculateBrandQuantity(products) {
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

    it('get the same list of brands using 2 different methods', () => {
        cy.log('Get the list of brands from the first API')
        getData(endpointsApi.getAllProductsList).then(response => {
            expect(response.status).to.equal(200)

            //Так как сервер отдает ответ в виде строки, применила метод parse, который
            //преобразует строку в формате JSON в объект JavaScript
            const body = JSON.parse(response.body)
            expect(body).to.have.property('products').and.to.be.an('array')
            const eachBrandQuantity = calculateBrandQuantity(body.products)
            cy.wrap(eachBrandQuantity).as('allBrandsFromAllProductsList')
        })

        cy.log('Get the list of brands from the second API')
        getData(endpointsApi.getAllBrandsList).then(response => {
            expect(response.status).to.equal(200)

            const body = JSON.parse(response.body)
            expect(body).to.have.property('brands').and.to.be.an('array')
            const eachBrandQuantity = calculateBrandQuantity(body.brands)
            cy.get('@allBrandsFromAllProductsList').should('deep.equal', eachBrandQuantity)
        })
       
    })
})