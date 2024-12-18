// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import 'cypress-map'

//uncaught:exception
//To conditionally turn off uncaught exception handling for a certain error
before(()=>{
    Cypress.on('uncaught:exception', (err, runnable) => {
    // we expect a 3rd party library error with message 'list not defined'
    // and don't want to fail the test so we return false
    console.log('ERROR IS...' , err)
    console.log('RUNNABLE...', runnable)
    if (err.message.includes('Script error.')) {
      return false
    }
    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
  })
})