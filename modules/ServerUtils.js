import path from 'path'
import invariant from 'invariant'
import ReactDOMServer from 'react-dom/server'
import { createElement } from 'react'

function getDefaultExports(file) {
  return require(file).default
}

function renderToStaticMarkup(element, callback) {
  return callback(null, ReactDOMServer.renderToStaticMarkup(element))
}

function renderToString(element, callback) {
  return callback(null, ReactDOMServer.renderToString(element))
}

function handleRequest(workingDir, request, callback) {
  const { component: componentPath, method, props } = request

  invariant(
    componentPath != null,
    'Missing { component } in request'
  )

  let render
  if (method === 'renderToStaticMarkup') {
    render = renderToStaticMarkup
  } else if (method === 'renderToString') {
    render = renderToString
  } else {
    const methodFile = path.resolve(workingDir, method)

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
    method
  )

  const componentFile = path.resolve(workingDir, componentPath)

  let component
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
    createElement(component, props),
    callback
  )
}

export function createRequestHandler(workingDir) {
  return function (request, callback) {
    try {
      handleRequest(workingDir, request, function (error, html) {
        if (error) {
          callback(error)
        } else if (typeof html !== 'string') {
          callback(new Error('Render method must return a string'))
        } else {
          callback(null, JSON.stringify({ html }))
        }
      })
    } catch (error) {
      callback(null, JSON.stringify({ error: error.message }))
    }
  }
}
