const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATHS = {
  app: path.join(__dirname, 'app'),
  dist: path.join(__dirname, 'dist'),
  index: path.join(__dirname, 'app/pages')
}

const plugins = [
  new MiniCssExtractPlugin({
    filename: "styles/style.css",
  }),
  new HtmlWebpackPlugin({
    template: PATHS.index + '/index.html' }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
]

module.exports = {
  entry: {
    main: [
      'babel-runtime/regenerator',
      'webpack-hot-middleware/client?reload=true',
      './app/scripts/app.js'
    ]
  },
  output: {
    path: PATHS.dist,
    filename: 'js/bundle.js',
    publicPath: '/'
  },
  devtool: "source-map",
  mode: 'development',
  devServer: {
    contentBase: 'dist',
    hot: true,
    overlay: true,
    stats: {
      colors: true
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.styl$/,
          chunks: 'all'
        }
      }
    }
  },
  plugins
};
