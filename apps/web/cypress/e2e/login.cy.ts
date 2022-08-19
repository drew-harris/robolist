import user from "../fixtures/login-details.json";
describe("Logs in", () => {
	beforeEach(() => {
		cy.setCookie("jwt", "asdifa");
	});
	it("passes", () => {
		cy.visit("/");
		cy.contains("robolist");
	});
	it("navigates to login page", () => {
		cy.visit("/");
		cy.get("*").contains("Log In").click();
		// Expect button
		cy.contains("Welcome back!");
		cy.get(".mantine-TextInput-root").type("invalidemail");
		cy.get(".mantine-PasswordInput-root").type("inva");
		cy.get(".mantine-Button-root").click();
		cy.get(".mantine-1q9vb2 > .mantine-Text-root").should("exist");
		cy.contains("Email or password is incorrect");
	});

	it("should navigate to signup page", () => {
		cy.visit("/signup");
		cy.get("button").contains("Sign Up").should("be.visible");
		cy.contains("Confirm Password");
	});

	it("should login", () => {
		cy.visit("http://localhost:3000/login");
		cy.get(".mantine-TextInput-root").type(user.email);
		cy.get(".mantine-PasswordInput-root").type(user.password);
		cy.get(".mantine-Button-root").click();
		cy.contains("Today");
		cy.contains("All Tasks");
	});
});

export {};
