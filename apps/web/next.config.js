const withTM = require("next-transpile-modules")(["types"]);

module.exports = withTM({
  reactStrictMode: true,
});
