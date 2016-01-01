var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

var nodeModules = fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
  'react-dom/server'
])

module.exports = {

  target: 'node',
  entry: path.join(__dirname, 'server.js'),

  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'react-stdio'
  },

  externals: nodeModules.reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {}),

  node: {
    process: false,
    __filename: true,
    __dirname: true
  },

  module: {
    noParse: /ModuleUtils\.js/,
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },

  plugins: [
    new webpack.BannerPlugin("#!/usr/bin/env node\n", {
      entryOnly: true,
      raw: true
    })
  ]

}
