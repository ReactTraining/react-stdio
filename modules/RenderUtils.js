import ReactDOMServer from 'react-dom/server'

export function renderToStaticMarkup(element, callback) {
  return callback(null, ReactDOMServer.renderToStaticMarkup(element))
}

export function renderToString(element, callback) {
  return callback(null, ReactDOMServer.renderToString(element))
}
