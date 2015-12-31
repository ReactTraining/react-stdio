require('babel-core/register')

var es = require('event-stream')
var JSONStream = require('jsonstream')
var createRequestHandler = require('./modules/ServerUtils').createRequestHandler

process.stdin
  .pipe(JSONStream.parse())
  .pipe(es.map(createRequestHandler(process.cwd())))
  .pipe(process.stdout)
