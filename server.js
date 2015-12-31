import es from 'event-stream'
import JSONStream from 'jsonstream'
import invariant from 'invariant'
import ReactDOMServer from 'react-dom/server'
import React from 'react'

function getComponent(moduleID) {
  return require(moduleID).default
}

function renderStaticMarkup(moduleID, props={}) {
  const component = getComponent(moduleID)

  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(component, props)
  )
}

function renderString(moduleID, props={}) {
  const component = getComponent(moduleID)

  return ReactDOMServer.renderToString(
    React.createElement(component, props)
  )
}

function handleRequest(data, callback) {
  const { component, type, props } = data

  invariant(
    component != null,
    'You must provide a component'
  )

  const render = (type === 'static') ? renderStaticMarkup : renderString

  let response
  try {
    response = {
      html: render(component, props)
    }
  } catch (error) {
    process.stderr.write(error.stack + '\n')

    response = {
      error: error.message
    }
  }

  callback(null, JSON.stringify(response))
}

// Start the server
process.stdin
  .pipe(JSONStream.parse())
  .pipe(es.map(handleRequest))
  .pipe(process.stdout)
