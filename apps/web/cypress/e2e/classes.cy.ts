import user from "../fixtures/login-details.json";
describe("Classes", () => {
	beforeEach(() => {
		cy.login(user.email, user.password);
	});
	it("Create new class", () => {
		cy.visit("/classes");
		cy.contains("Classes");
		// cy.get("#newclassbutton").first().click();

		// const className = "Stats - " + Math.floor(Math.random() * 100);
		// cy.get("#class-name-input").type(className);
		// cy.get("button").contains("Submit").click();
		// cy.contains(className);
	});
});

export {};
