import user from "../fixtures/login-details.json";
describe("changes settings", () => {
	beforeEach(() => {
		cy.login(user.email, user.password);
	});
	it("Views Behavior Page", () => {
		cy.visit("/settings");
		cy.get("*").contains("Behavior").first().click();

		cy.contains("Focus Timer");
		cy.contains("Daily Tasks");
		cy.contains("Strict Mode");
	});
});

export {};
