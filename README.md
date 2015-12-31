# react-stdio

[react-stdio](https://github.com/mjackson/react-stdio) lets you render [React](https://facebook.github.io/react/) components on the server, regardless of the backend technology you're using.

As its name suggests, other processes communicate with react-stdio using standard streams. The protocol is JSON, so any language that can spawn a child process and write JSON to its stdin can use the server. Requests are handled serially, so responses are issued in the same order requests are received.

## Installation

Using [npm](https://npmjs.com):

    $ npm install react-stdio

## Usage

Once you've installed the server, you will have a `react-stdio` binary available (assuming `node_modules/.bin` is in your `$PATH`). Execute it to start the server.

To render a React component, write a JSON blob to stdin with any of the following properties:

    component       The path to a file that exports a React component (required)
    props           Any props you want to pass to the component (optional, default is {})
    method          The type of rendering (optional, default is renderToString)

If the request is successful, the server will put a JSON blob with `{"html":"..."}` on stdout. If the request fails for some reason, the JSON will have an `error` property instead of `html`.

Example:

    $ echo '{"component":"./MyComponent","props":{"message":"hello"}}' | react-stdio
