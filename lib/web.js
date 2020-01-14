const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const fs = require('fs');
const merge = require('webpack-merge')
const devConfig = require('./config/dev');
const prodConfig = require('./config/prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

function mergeConfig(argv, isDev) {
  let config = isDev ? devConfig : prodConfig;
  if (argv.entry) {
    config = merge(config, { entry: argv.entry, plugins: [
      new HtmlWebpackPlugin({
        title: '',
        inlineSource: '.(js|css)$'
      })]
    });
  } else if (argv.config) {
    fs.readFile(argv.config, (err, data) => {
      if (err) throw new Error(err);
      const entry = JSON.parse(data);
      const plugins = Object.keys(entry).map(e => new HtmlWebpackPlugin({
        title: '',
        filename: `${e}.html`,
        inlineSource: '.(js|css)$',
        chunks: [e]
      }));

      config = merge(config, { entry, plugins });
    })
  }
  return config;
}

exports.handler = function (argv) {
  const config = mergeConfig(argv, argv.watch);
  const compiler = webpack(config);
  if (argv.watch) {
    new WebpackDevServer(compiler).listen(3000)
    return;
  }
  compiler.run(handlerErr);
}

function build() {

}

function dev() {

}