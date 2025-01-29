export const ENDPOINTS = {
    UI : {
        LOGIN: 'login',
        SIGNUP: 'signup',
        CART: 'view_cart',
        CHECKOUT: 'checkout',
        PAYMENT: 'payment',
        SUCCESSFULLPAYMENT: 'payment_done'
    },
    API : {
        getAllProductsList: 'api/productsList',
        getAllBrandsList: 'api/brandsList',
        addToCart : 'add_to_cart',
        createAccount: '/api/createAccount',
        login: '/api/verifyLogin',
        deleteUserAccount: '/api/deleteAccount',
        searchProduct: 'api/searchProduct'
    }
}