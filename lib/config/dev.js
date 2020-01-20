const base = require('./base');
const merge = require('webpack-merge');

module.exports = merge(base, {
  mode: "development", 
  devtool: "source-map",
  devServer: {
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8001,
    open: true,
    allowedHosts: [
    ]
  }
})