import user from "../fixtures/login-details.json";
describe("Classes", () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("jwt");
  });
  it("logs in", () => {
    cy.visit("http://localhost:3000/login");
    cy.get(".mantine-TextInput-root").type(user.email);
    cy.get(".mantine-PasswordInput-root").type(user.password);
    cy.get(".mantine-Button-filled").click();
  });

  it("navigates to classes", () => {
    cy.get(
      ":nth-child(3) > .mantine-UnstyledButton-root > .mantine-Group-root"
    ).click();
    cy.contains("Classes");
  });

  it("clicks overview menu", () => {
    cy.get(".mantine-ThemeIcon-root").click();
    const newClassButton = cy.get(".mantine-1j0qvum > :nth-child(2)");
    newClassButton.should("be.visible");
    newClassButton.click();
    cy.contains("New Class");
  });

  it("fills out form", () => {
    const classNameInput = cy.get("label");
    classNameInput.should("be.visible");
    // Add random number suffix
    cy.get(".mantine-Button-filled").click();
    cy.contains("Name is required");
    cy.get(".mantine-121w2fi > .mantine-ActionIcon-hover").click();
  });
});

export {};
