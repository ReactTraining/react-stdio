# react-stdio

[react-stdio](https://github.com/mjackson/react-stdio) lets you render [React](https://facebook.github.io/react/) components on the server, regardless of the backend technology you're using.

As its name suggests, other processes communicate with react-stdio using standard streams. The protocol is JSON, so any environment that can spawn a child process and write JSON to its stdin can use the server. Requests are handled serially, so responses are issued in the same order requests are received.

## Installation

Using [npm](https://npmjs.com):

    $ npm install react-stdio

## Usage

Once you've installed the server, you will have a `react-stdio` binary available (assuming `node_modules/.bin` is in your `$PATH`). Execute it to start the server.

To render a React component, write a JSON blob to stdin with any of the following properties:

    component       The path to a file that exports a React component (required)
    props           Any props you want to pass to the component (optional, default is {})
    render          The type of rendering (optional, default is renderToString)

If the request is successful, the server will put a JSON blob with `{"html":"..."}` on stdout. If the request fails for some reason, the JSON will have an `error` property instead of `html`.

Example:

    $ echo '{"component":"./MyComponent","props":{"message":"hello"}}' | react-stdio

If you'd like to use a render method other than [`renderToString`](https://facebook.github.io/react/docs/top-level-api.html#reactdomserver.rendertostring) or [`renderToStaticMarkup`](https://facebook.github.io/react/docs/top-level-api.html#reactdomserver.rendertostaticmarkup) you can pass a path to a file that exports your rendering function. The signature of your `render` function should be:

```js
function render(element, callback) {
  // ...
}
```

This function is asynchronous so you have time to do data fetching before you render if you wish. Call `callback(error, html)` when you're finished.

## Environment

Your component file (and, optionally, your render file) are loaded in a node.js environment with Babel's [es2015](https://babeljs.io/docs/plugins/preset-es2015/) and [react](https://babeljs.io/docs/plugins/preset-react/) presets installed. If you need some other code transforms to run first (e.g. webpack or Browserify) you should create your bundle first and tell react-stdio to load your bundle instead of the plain component file.
