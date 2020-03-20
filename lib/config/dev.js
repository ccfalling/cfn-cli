const base = require('./base');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(base, {
  mode: "development", 
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: () => {
        return `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,minimum-scale=1.0">
            <title><%= htmlWebpackPlugin.options.title %></title>
          </head>
          <body>
            <noscript>
              <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
            </noscript>
            <div id="app"></div>
            <!-- built files will be auto injected -->
          </body>
        </html>
        `
      }
    }),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
    open: true,
    port: 8080
  }
})