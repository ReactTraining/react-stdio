import path from 'path'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { createElement } from 'react'

function getComponent(file) {
  return require(file).default
}

export function createRequestHandler(workingDir) {
  return function (request, callback) {
    const { component: componentPath, method, props } = request

    let response
    if (componentPath == null) {
      response = {
        error: 'Missing a { component } property'
      }
    } else {
      const componentFile = path.resolve(workingDir, componentPath)
      const render = (method === 'renderToStaticMarkup') ? renderToStaticMarkup : renderToString

      try {
        const component = getComponent(componentFile)
        const element = createElement(component, props)

        response = {
          html: render(element)
        }
      } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
          response = {
            error: 'Cannot find file ' + componentFile
          }
        } else {
          process.stderr.write(error.stack + '\n')

          response = {
            error: error.message
          }
        }
      }
    }

    callback(null, JSON.stringify(response))
  }
}
