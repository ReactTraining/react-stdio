const { createElement: h } = require('react')
let context = {}

const component = function() {
  context.test = true
  return h('div', null, 'I am a context component')
}

component.context = context

module.exports = component
