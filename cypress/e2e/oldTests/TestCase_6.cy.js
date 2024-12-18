/// <reference types='cypress' />
import "cypress-file-upload";

//   Author : Yurii
//   Created 08.11.2024
//1. Launch browser - сайпрес делает это автоматически
//2. Navigate to url 'http://automationexercise.com' - сайпрес делает это автоматически
//3. Verify that home page is visible successfully - сайпрес делает это автоматически
//4. Click on 'Contact Us' button
//5. Verify 'GET IN TOUCH' is visible
//6. Enter name, email, subject and message
//7. Upload file
//8. Click 'Submit' button
//9. Click OK button
//10. Verify success message 'Success! Your details have been submitted successfully.' is visible
//11. Click 'Home' button and verify that landed to home page successfully

// Функция для генерирования регистационных данных вместо:
// https://www.npmjs.com/package/@faker-js/faker
function fakeData(n, email = "") {
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let rtn = "";
  for (let i = 0; i < n; i++) {
    rtn += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  if (email !== "") {
    rtn += "@fake.com";
  }
  return rtn;
}

describe(
  "Test Case 6: Contact Us Form",
  {
    testIsolation: false,
  },
  () => {
    before(() => {
      cy.visit("/");
    });
    it("1. Launch browser", () => {
      // сайпрес делает это автоматически
    });
    it("2. Navigate to url", () => {
      // Сделал в блоке before
    });

    it("3. Verify that home page is visible successfully", () => {
      // Последним загружался этот элемент, провеврили что он есть обратившийсь к нему
      cy.get('link[rel = "shortcut icon"]');
    });
    it("4. Click on 'Contact Us' button", () => {
      cy.get("a[href='/contact_us']").click();
    });
    it("5. Verify 'GET IN TOUCH' is visible", () => {
      cy.get("h2.title.text-center:nth-child(2)")
        .should("have.css", "text-transform", "uppercase")
        .should("have.text", "Get In Touch");
      // Альтернативный вариант:
      // cy.get("h2.title.text-center:nth-child(2)")
      //   .invoke("text") // Получаем текст элемента
      //   .then((text) => {
      //     expect(text.trim().toUpperCase()).to.equal("GET IN TOUCH");
      //   });
    });
    it("6. Enter name, email, subject and message", () => {
      cy.get('[name="name"]').type(fakeData(5));
      cy.get('[name="email"]').type(fakeData(5, 1));
      cy.get('[name="subject"]').type(fakeData(45));
      cy.get('[name="message"]').type(fakeData(100));
    });
    it.skip("7. Upload file", () => {
      // Cypress не взаимодействует с системными окнами. Но есть решение:
      // https://www.npmjs.com/package/cypress-file-upload
      cy.get('[name="upload_file"]').attachFile(
        "../fixtures/Files/500_words.txt"
      );
    });
    it("8. Click 'Submit' button", () => {
      cy.get('[name="submit"]').click();
    });
    it("9. Click OK button", () => {
      // сайпрес делает это автоматически
      // https://docs.cypress.io/api/cypress-api/catalog-of-events#Window-Alert
    });
    it("10. Verify success message", () => {
      cy.get("div.status.alert.alert-success")
        .should("be.visible")
        .should(
          "have.text",
          "Success! Your details have been submitted successfully."
        );
    });
    it("11. Go to the main page", () => {
      cy.get("a.btn-success").click();
      cy.url().should("eq", "https://automationexercise.com/");
    });
  }
);
