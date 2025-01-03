
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