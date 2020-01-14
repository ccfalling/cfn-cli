const base = require('./base');
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = merge(base, {
  mode: "production",
  plugins: [new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)]
})