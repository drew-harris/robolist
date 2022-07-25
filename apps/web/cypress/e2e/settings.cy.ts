import user from "../fixtures/login-details.json";
describe("changes settings", () => {
  beforeEach(() => {
    cy.login(user.email, user.password);
  });
  it("show estimated work time", () => {
    cy.visit("/");
    cy.get(":nth-child(2) > .mantine-ThemeIcon-root").click();
    cy.contains("Settings");
    // Turn on checkbox
    cy.get('[type="checkbox"]').eq(0).uncheck();
    cy.get('[type="checkbox"]').eq(0).should("not.be.checked");
    cy.get('[type="checkbox"]').eq(0).check();
    cy.get('[type="checkbox"]').eq(0).should("be.checked");
    cy.contains("Use Time Estimation");

    cy.get(":nth-child(1) > .mantine-ThemeIcon-root").click();
    cy.get(
      ":nth-child(1) > .mantine-Group-root > .mantine-Spotlight-actionBody > .mantine-Text-root > span"
    ).click();

    cy.contains("Estimated Work Time");
  });
  it("hide estimated work time", () => {
    cy.visit("/");
    cy.get(":nth-child(2) > .mantine-ThemeIcon-root").click();
    cy.contains("Settings");
    // Turn on checkbox
    cy.get('[type="checkbox"]').eq(0).uncheck();
    cy.get('[type="checkbox"]').eq(0).should("not.be.checked");
    cy.contains("Use Time Estimation");

    cy.get(":nth-child(1) > .mantine-ThemeIcon-root").click();
    cy.get(
      ":nth-child(1) > .mantine-Group-root > .mantine-Spotlight-actionBody > .mantine-Text-root > span"
    ).click();

    cy.get("*").should("not.contain", "Estimated Work Time");
  });
});

export {};
