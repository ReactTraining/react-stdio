import es from 'event-stream'
import JSONStream from 'jsonstream'
import { createRequestHandler } from './modules/ServerUtils'

process.stdin
  .pipe(JSONStream.parse())
  .pipe(es.map(createRequestHandler(process.cwd())))
  .pipe(process.stdout)
