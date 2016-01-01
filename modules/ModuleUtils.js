// We tell webpack not to parse this file (using noParse)
// so we can use node's require in the generated bundle.

exports.getDefaultExports = function (file) {
  const moduleExports = require(file)

  // Return the "default" export if using ES2015 modules.
  if (moduleExports && moduleExports.default)
    return moduleExports.default

  return moduleExports
}
