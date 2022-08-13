import user from "../fixtures/login-details.json";
describe("changes settings", () => {
	beforeEach(() => {
		cy.login(user.email, user.password);
	});
	it("show estimated work time", () => {
		cy.visit("/settings");

		cy.contains("Settings");
		// Turn on checkbox
		// cy.get('[type="checkbox"]').eq(1).uncheck();
		// cy.get('[type="checkbox"]').eq(1).should("not.be.checked");
		// cy.get('[type="checkbox"]').eq(1).check();
		// cy.get('[type="checkbox"]').eq(1).should("be.checked");
		// cy.contains("Use Time Estimation");

		// cy.get(":nth-child(1) > .mantine-ThemeIcon-root").click();
		// cy.get(
		// 	":nth-child(1) > .mantine-Group-root > .mantine-Spotlight-actionBody > .mantine-Text-root > span"
		// ).click();

		// cy.contains("Estimated Work Time");
	});
	it("hide estimated work time", () => {
		cy.visit("/settings");
		// cy.contains("Settings");
		// // Turn on checkbox
		// cy.get('[type="checkbox"]').eq(1).uncheck();
		// cy.get('[type="checkbox"]').eq(1).should("not.be.checked");
		// cy.contains("Use Time Estimation");

		// cy.get(":nth-child(1) > .mantine-ThemeIcon-root").click();
		// cy.get(
		// 	":nth-child(1) > .mantine-Group-root > .mantine-Spotlight-actionBody > .mantine-Text-root > span"
		// ).click();

		// cy.get("*").should("not.contain", "Estimated Work Time");
	});
});

export {};
