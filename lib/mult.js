const webpack = require('webpack')
const fs = require('fs');
const merge = require('webpack-merge')
const baseConfig = require('./config/base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');


exports.command = 'mult';
exports.describe = 'build mult entry html page';
exports.builder = {
}
exports.handler = function (argv) {
  if (argv.entry) {
    const config = merge(baseConfig, { entry, plugins: [
      new HtmlWebpackPlugin({
        inlineSource: '.(js|css)$'
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)]
    });

    webpack(config).run();
  } else if (argv.config) {
    fs.readFile(argv.config, (err, data) => {
      if (err) throw new Error(err);
      const entry = JSON.parse(data);
      const plugins = Object.keys(entry).map(e => new HtmlWebpackPlugin({
        filename: `${e}.html`,
        inlineSource: '.(js|css)$',
        chunks: [e]
      }));
      plugins.push(new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin));

      const config = merge(baseConfig, { entry, plugins });
      webpack(config).run();
    })
  }
}

function build() {

}

function dev() {

}