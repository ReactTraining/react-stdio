# react-stdio

[react-stdio](https://github.com/mjackson/react-stdio) is a simple server for rendering React components on the server. It's mainly useful when you're using something other than node.js as your backend.

As its name suggests, other processes communicate with react-stdio using standard streams. The protocol is JSON, so any language that can spawn a child process and write to its stdin can use the server. Requests are handled serially, so responses are issued in the same order requests are received.

## Installation

Using [npm](https://npmjs.com):

    $ npm install react-stdio

## Usage

Once you've installed the server, you will have a `react-stdio` binary available (assuming `node_modules/.bin` is in your `$PATH`). Execute it to start the server.

To render a React component, put a JSON blob on stdin with any of the following properties:

    component       The path to a file that exports a React component (required)
    props           Any props you want to pass to the component (optional, default is {})
    method          The type of rendering (optional, default is renderToString)

Example:

    $ echo '{"component":"./MyComponent","props":{"message":"hello"}}' | react-stdio
