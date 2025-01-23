/// <reference types="cypress" />
import Header from "./headerPage"

class PaymentDonePage extends Header {
    getDownloadInvoiceLink = () => cy.get('a').contains('Download Invoice')

    clickDownloadInvoiceLink() {
        this.getDownloadInvoiceLink().click()
        return this
    }
}

export default PaymentDonePage