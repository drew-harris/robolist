describe("Logs in", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("robolist");
  });
  it("navigates to login page", () => {
    cy.get(".mantine-1k39fgh > :nth-child(1)").click();
    // Expect button
    cy.contains("Welcome back!");
  });
  it("should type invalid fields", () => {
    cy.get(".mantine-TextInput-root").type("invalidemail");
    cy.get(".mantine-PasswordInput-root").type("inva");
    cy.get(".mantine-Button-filled").click();
    cy.get(".mantine-1q9vb2 > .mantine-Text-root").should("exist");
    // cy.contains("Email or password is incorrect");
  });

  it("should navigate to signup page", () => {
    const createAccountButton = cy.get(".mantine-1nwce10 > .mantine-Text-root");
    createAccountButton.should("exist");
    createAccountButton.click();

    cy.url().should("include", "signup");
  });
});

export {};
