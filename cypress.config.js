const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1366,   // Ancho en píxeles
  viewportHeight: 768,   // Alto en píxeles
  reporter: 'cypress-mochawesome-reporter',

  reporterOptions: {
    charts: true,
    reportPageTitle: 'Reporter Automation Project FDA TL',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  retries: 1,
  defaultCommandTimeout: 5000,
  fixturesFolder: 'cypress/fixtures',

  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
