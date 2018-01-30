const React = require("react");

let context = {};

const component = function() {
  context.test = true;
  return React.createElement("div", null, "I am a context component");
};

component.context = context;

module.exports = component;
