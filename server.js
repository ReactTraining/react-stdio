require('babel-register')({
  presets: [ 'es2015', 'react' ]
})

var es = require('event-stream')
var JSONStream = require('JSONStream')
var createRequestHandler = require('./modules/ServerUtils').createRequestHandler

process.stdin
  .pipe(JSONStream.parse())
  .pipe(es.map(createRequestHandler(process.cwd())))
  .pipe(process.stdout)
