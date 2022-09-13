import user from "../fixtures/login-details.json";
describe("Classes", () => {
	beforeEach(() => {
		cy.login(user.email, user.password);
	});
	it("Edits the first class", () => {
		cy.visit("/classes");
		cy.contains("Classes");
		cy.get(".class-menu").first().click();
		// Get element containing "Edit"
		cy.get("*").contains("Edit").click();
		cy.get("#class-name-input").first().clear().type("Test Class");
		cy.get("button[type=submit]").click();
		cy.get("*").contains("Test Class").should("be.visible");
	});

	it("Adds a new class", () => {
		cy.visit("/classes");
		cy.contains("Classes");
		cy.get("button").contains("New Class").click();
		const randomInt = Math.floor(Math.random() * 1000);
		cy.get("#class-name-input")
			.first()
			.clear()
			.type("Another Class-" + randomInt);
		cy.get("button[type=submit]").click();
		cy.get("*")
			.contains("Another Class-" + randomInt)
			.should("be.visible");
	});

	it("Deletes A Class", () => {
		cy.visit("/classes");
		cy.contains("Classes");
		cy.get(".class-menu").first().click();
		cy.get("*").contains("Delete").click();
		cy.get("*").contains("Delete Class?").should("be.visible");
	});
});

export {};
