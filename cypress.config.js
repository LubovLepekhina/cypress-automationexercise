const { defineConfig } = require("cypress");

module.exports = defineConfig({
  watchForFileChanges: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/results',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
    overwrite: true,
    videoOnFailOnly: true
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
    },
    baseUrl: 'https://automationexercise.com/'
  },
});
