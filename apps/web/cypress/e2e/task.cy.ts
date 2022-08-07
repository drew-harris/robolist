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
});

export { };
