const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const server = express();
const config = require('../webpack.config.js');
const compiler = webpack(config);

const webpackDevMiddlewares = webpackDevMiddleware(
  compiler,
  config.devServer,
  config.output.publicPath
)

const webpackHotMiddlewares = webpackHotMiddleware(compiler)

server.use(webpackDevMiddlewares);
server.use(webpackHotMiddlewares);

// Serve the files on port 3000.
server.listen(3000, function () {
  console.log('Example server listening on port 3000!\n');
});
