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

function run(argv, config) {
  const compiler = webpack(config);
  if (argv.watch) {
    const dev = new WebpackDevServer(compiler, config.devServer).listen(config.devServer.port, (err) => {
      if (err) console.log(err)
    });
    return;
  }
  compiler.run(handlerErr);
}

function mergeConfig(argv, isDev) {
  let config = isDev ? devConfig : prodConfig;
  if (argv.entry) {
    config = merge(config, { entry: argv.entry, plugins: [
      new HtmlWebpackPlugin({
        title: '',
        filename: 'index.html',
        inlineSource: '.(js|css)$'
      })]
    });
    run(argv, config);
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
      run(argv, config);
    })
  }
}

exports.handler = function (argv) {
  mergeConfig(argv, argv.watch);
}

function build() {

}

function dev() {

}