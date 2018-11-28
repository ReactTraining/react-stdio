const React = require("react");

let context = {};

function ContextComponent() {
  context.test = true;
  return React.createElement("div", null, "I am a context component");
}

ContextComponent.context = context;

module.exports = ContextComponent;
