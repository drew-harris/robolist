/// <reference types="cypress" />

import user from "../fixtures/login-details.json";

import cypress from "cypress";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
	namespace Cypress {
		interface Chainable {
			login(username: string, password: string): Chainable<void>;
			drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
			dismiss(
				subject: string,
				options?: Partial<TypeOptions>
			): Chainable<Element>;
		}
	}
}

Cypress.Commands.add("login", (email, password) => {
	cy.session([email, password], () => {
		cy.request({
			method: "POST",
			url: "/api/login",
			body: { email, password },
		}).then(({ body }) => {
			// Set cookie
			cy.log(body.jwt);
			cy.setCookie("jwt", body.jwt);
		});
	});
});

export {};
