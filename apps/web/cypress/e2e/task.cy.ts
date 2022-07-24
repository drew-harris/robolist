import user from "../fixtures/login-details.json";
describe("task", () => {
  beforeEach(() => {
    cy.login(user.email, user.password);
  });
  it("sees the task", () => {
    cy.visit("/");
    cy.contains("Tasks");
    cy.contains("Dog Training");
  });
  it("can create new task", () => {
    cy.visit("/");
    cy.contains("Tasks");
    cy.get(".mantine-ThemeIcon-root").first().click();
    cy.get("*").contains("New Task").click();
    cy.get(".mantine-TextInput-root").first().type("Learn to sit");
    cy.get("button").contains("Submit").click();
    cy.contains("Missing field");
  });
});

export {};
