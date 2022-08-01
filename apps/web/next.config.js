const withTM = require("next-transpile-modules")(["types"]);
const { withAxiom } = require("next-axiom");

module.exports = withAxiom(
	withTM({
		reactStrictMode: true,
	})
);
