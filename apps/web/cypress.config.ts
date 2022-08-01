import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		experimentalSessionAndOrigin: true,
		baseUrl: "http://localhost:3000",
	},
	video: false,
});
