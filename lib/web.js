const webpack = require('webpack')
const fs = require('fs');
const merge = require('webpack-merge')
const baseConfig = require('./config/base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');


exports.command = 'web';
exports.describe = 'build mult entry html page';
exports.builder = {
}

function handlerErr(err, stats) {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    info.errors.forEach(e => {
      console.error(e);
    })
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
}

exports.handler = function (argv) {
  if (argv.entry) {
    const config = merge(baseConfig, { entry: argv.entry, plugins: [
      new HtmlWebpackPlugin({
        inlineSource: '.(js|css)$'
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)]
    });
    webpack(config).run(handlerErr);
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
      webpack(config).run(handlerErr);
    })
  }
}

function build() {

}

function dev() {

}