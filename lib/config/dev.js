const base = require('./base');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(base, {
  mode: "development", 
  devtool: "source-map",
  devServer: {
    hot: true,
    historyApiFallback: true,
    open: true,
    port: 8080
  }
})