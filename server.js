var path = require('path')
var invariant = require('invariant')
var EventStream = require('event-stream')
var JSONStream = require('JSONStream')
var ReactDOMServer = require('react-dom/server')
var React = require('react')

function getDefaultExports(file) {
  var moduleExports = require(file)

  // Return exports.default if using ES2015 modules.
  if (moduleExports && moduleExports.default)
    return moduleExports.default

  return moduleExports
}

function renderToStaticMarkup(element, callback) {
  callback(null, ReactDOMServer.renderToStaticMarkup(element))
}

function renderToString(element, callback) {
  callback(null, ReactDOMServer.renderToString(element))
}

function handleRequest(workingDir, request, callback) {
  var componentPath = request.component
  var renderMethod = request.render
  var props = request.props

  invariant(
    componentPath != null,
    'Missing { component } in request'
  )

  var render
  if (renderMethod == null || renderMethod === 'renderToString') {
    render = renderToString
  } else if (renderMethod === 'renderToStaticMarkup') {
    render = renderToStaticMarkup
  } else {
    var methodFile = path.resolve(workingDir, renderMethod)

    try {
      render = getDefaultExports(methodFile)
    } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND')
        process.stderr.write(error.stack + '\n')
    }
  }

  invariant(
    typeof render === 'function',
    'Cannot load render method: %s',
    renderMethod
  )

  var componentFile = path.resolve(workingDir, componentPath)

  var component
  try {
    component = getDefaultExports(componentFile)
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND')
      process.stderr.write(error.stack + '\n')
  }

  invariant(
    component != null,
    'Cannot load component: %s',
    componentPath
  )

  render(
    React.createElement(component, props),
    callback
  )
}

function createRequestHandler(workingDir) {
  return function (request, callback) {
    try {
      handleRequest(workingDir, request, function (error, html) {
        if (error) {
          callback(error)
        } else if (typeof html !== 'string') {
          // Crash the server process.
          callback(new Error('Render method must return a string'))
        } else {
          callback(null, JSON.stringify({ html: html }))
        }
      })
    } catch (error) {
      callback(null, JSON.stringify({ error: error.message }))
    }
  }
}

// Redirect stdout to stderr, but save a reference so we can
// still write to stdout.
var stdout = process.stdout
Object.defineProperty(process, 'stdout', {
  configurable: true,
  enumerable: true,
  value: process.stderr
})

// Ensure console.log knows about the new stdout.
var Console = require('console').Console
console = new Console(process.stdout, process.stderr)

// Read JSON blobs from stdin, pipe output to stdout.
process.stdin
  .pipe(JSONStream.parse())
  .pipe(EventStream.map(createRequestHandler(process.cwd())))
  .pipe(stdout)
