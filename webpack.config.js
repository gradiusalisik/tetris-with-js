const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  app: path.join(__dirname, 'app'),
  dist: path.join(__dirname, 'dist'),
  index: path.join(__dirname, 'app/pages')
}

module.exports = {
  entry: PATHS.app + '/scripts/app.js',
  output: {
    path: PATHS.dist,
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({template: PATHS.index + '/index.html'})
  ],
  // devtool: "source-map",
  // module: {
  //   rules: [
  //     {
  //       test: /.pug$/,
  //       use: {
  //         loader: 'pug-loader',
  //         options: {
  //           pretty: true
  //         },
  //         query: {}
  //       }
  //     }
  //   ]
  // },
  devServer: {
    inline: true,
    port: 3000,
    stats: 'errors-only'
  }
};
