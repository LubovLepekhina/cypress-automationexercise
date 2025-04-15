# AutomationExercise - Automated Testing Project

**Overview**

AutomationExercise is an automated testing project designed to validate the functionality of a full-fledged practice website for QA engineers. The project includes end-to-end testing for web and API functionality using Cypress and JavaScript. It ensures that key user flows, such as registration, authentication, product searches, and checkout process- es, work as expected. The tests cover various scenarios, including both valid and invalid requests, and are structured using best practices like the Page Object Model (POM) for UI testing and reusable test functions for API validation.

The tests are performed on the following website:

`https://automationexercise.com/`

**Installation:**

1. Clone the repository:

`git clone https://github.com/LubovLepekhina/cypress-automationexercise.git`

2. Install dependencies: 

`npm ci`

**Running Tests:**

*Run all tests in headless mode:*

`npx cypress run`

*Open Cypress test runner:*

`npx cypress open`

For more details on available test scripts, check the `scripts` section in the `package.json` file. To run a script, use:  

`npm run <script-name>`  

For example:  

`npm run test:run:chrome`

**Plugins Used:**

- cypress-ajv-schema-validator - Validates API responses against JSON schemas to ensure data integrity.

- cypress-plugin-api - Enables flexible assertions for API responses, allowing for partial matching and constraints.

- cy-spok - Simplifies API testing with custom Cypress commands.

- @faker-js/faker - Generates dynamic test data for improved test coverage.

- cypress-mochawesome-reporter - Generates detailed, visually rich test reports with screenshots and videos embedded for easier debugging.

- cypress-recurse - Re-runs Cypress commands until a predicate function returns true.

- cypress-file-upload - adds a custom Cypress command that allows you to make an abstraction on how exactly you upload files through HTML controls and focus on testing user workflows.

**Test Organization**

This project uses the Page Object Model (POM) pattern to improve code structure, reusability, and readability.
Each page or component is represented by its own class file that contains selectors and actions, making test maintenance easier and cleaner.