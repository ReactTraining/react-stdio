const path = require("path");
const invariant = require("invariant");
const EventStream = require("event-stream");
const JSONStream = require("JSONStream");
const ReactDOMServer = require("react-dom/server");
const React = require("react");

function loadModule(moduleId) {
  // Clear the require cache, in case the file was
  // changed since the server was started.
  const cacheKey = require.resolve(moduleId);
  delete require.cache[cacheKey];

  const moduleExports = require(moduleId);

  // Return exports.default if using ES modules.
  if (moduleExports && moduleExports.default) {
    return moduleExports.default;
  }

  return moduleExports;
}

function renderToStaticMarkup(element, callback) {
  callback(null, ReactDOMServer.renderToStaticMarkup(element));
}

function renderToString(element, callback) {
  callback(null, ReactDOMServer.renderToString(element));
}

function handleRequest(workingDir, request, callback) {
  const componentPath = request.component;
  const renderMethod = request.render;
  const props = request.props;

  invariant(componentPath != null, "Missing { component } in request");

  let render;
  if (renderMethod == null || renderMethod === "renderToString") {
    render = renderToString;
  } else if (renderMethod === "renderToStaticMarkup") {
    render = renderToStaticMarkup;
  } else {
    const methodFile = path.resolve(workingDir, renderMethod);

    try {
      render = loadModule(methodFile);
    } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") {
        process.stderr.write(error.stack + "\n");
      }
    }
  }

  invariant(
    typeof render === "function",
    "Cannot load render method: %s",
    renderMethod
  );

  const componentFile = path.resolve(workingDir, componentPath);

  let component;
  try {
    component = loadModule(componentFile);
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      process.stderr.write(error.stack + "\n");
    }
  }

  invariant(component != null, "Cannot load component: %s", componentPath);

  render(React.createElement(component, props), callback);
}

function createRequestHandler(workingDir) {
  return function(request, callback) {
    try {
      handleRequest(workingDir, request, function(error, html) {
        if (error) {
          callback(error);
        } else if (typeof html !== "string") {
          // Crash the server process.
          callback(new Error("Render method must return a string"));
        } else {
          callback(null, JSON.stringify({ html: html }));
        }
      });
    } catch (error) {
      callback(null, JSON.stringify({ error: error.message }));
    }
  };
}

// Redirect stdout to stderr, but save a reference so we can
// still write to stdout.
const stdout = process.stdout;
Object.defineProperty(process, "stdout", {
  configurable: true,
  enumerable: true,
  value: process.stderr
});

// Ensure console.log knows about the new stdout.
const Console = require("console").Console;
Object.defineProperty(global, "console", {
  configurable: true,
  enumerable: true,
  value: new Console(process.stdout, process.stderr)
});

// Read JSON blobs from stdin, pipe output to stdout.
process.stdin
  .pipe(JSONStream.parse())
  .pipe(EventStream.map(createRequestHandler(process.cwd())))
  .pipe(stdout);
