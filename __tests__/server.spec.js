const { spawn } = require('child_process')
const path = require('path')

describe('server', function() {
  let proc

  beforeEach(function() {
    proc = spawn(path.join(__dirname, '..', 'bin', 'react-stdio'), {
      stdio: 'pipe'
    })
  })

  afterEach(function() {
    proc.kill()
  })

  it('throws an error when component is missing', function(done) {
    proc.stdin.write(JSON.stringify({}))

    proc.stdout.once('data', function(out) {
      expect(JSON.parse(out).error).toEqual('Missing { component } in request')

      done()
    })
  })

  it('throws an error when component cannot be found', function(done) {
    proc.stdin.write(JSON.stringify({ component: 'component.js' }))

    proc.stdout.once('data', function(out) {
      expect(JSON.parse(out).error).toEqual(
        'Cannot load component: component.js'
      )

      done()
    })
  })

  it('renders the component', function(done) {
    proc.stdin.write(
      JSON.stringify({
        component: path.join(__dirname, '..', '__mocks__', 'testComponent.js')
      })
    )

    proc.stdout.once('data', function(out) {
      expect(JSON.parse(out).html).toMatch('I am a test component')

      done()
    })
  })

  it('renders a component and exposes additional context', function(done) {
    proc.stdin.write(
      JSON.stringify({
        component: path.join(
          __dirname,
          '..',
          '__mocks__',
          'contextComponent.js'
        )
      })
    )

    proc.stdout.once('data', function(out) {
      const result = JSON.parse(out)

      expect(result.html).toMatch('I am a context component')
      expect(result.context).toEqual({ test: true })

      done()
    })
  })
})
