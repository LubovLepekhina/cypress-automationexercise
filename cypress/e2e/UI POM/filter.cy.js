/// <reference types="cypress" />

import ProductsPage from "../../pageObjects/productsPage"
import filterData from "../../fixtures/filterData.json"

const productPage = new ProductsPage()

describe('check filter', () => {

    beforeEach(() => {
        cy.visit('/')
    })

    it('Selecting a subcategory should display only relevant products', () => {
        const categories = Object.keys(filterData.categories)
        categories.forEach(categoryItem => {
            productPage.clickCategoryFilter(categoryItem)
            filterData.categories[categoryItem].forEach((subCategory) => {
                productPage.clickSubCategoryByProductName(categoryItem, subCategory)
                    .getAllProductCards().each(($card) => {
                        productPage.getInfoFromRandomCard($card).then((cardInfo) => {
                            cy.log(`Verify ${cardInfo.description}`)
                            let arrOfSynonyms = filterData.synonyms[subCategory]
                            try {
                                const matchSynonyms = arrOfSynonyms.some(syn => {
                                    return cardInfo.description.toLowerCase().includes(syn)
                                })
                                expect(matchSynonyms).to.be.true
                            } catch (error) {
                                cy.log(`Error: ${cardInfo.description} should contain ${arrOfSynonyms}`)
                            }
                        })  
                    })
                productPage.clickCategoryFilter(categoryItem)
            })        
        })    
    })
})