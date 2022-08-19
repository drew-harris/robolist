const withTM = require("next-transpile-modules")(["types", "trpc-server"]);
const { withAxiom } = require("next-axiom");

module.exports = withAxiom(
	withTM({
		reactStrictMode: true,
		swcMinify: true,
		compiler: {
			removeConsole: process.env.NODE_ENV === "production",
		}
	})
);
