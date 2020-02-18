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

function run(config, isDev) {
  const compiler = webpack(config);
  if (isDev) {
    const dev = new WebpackDevServer(compiler, config.devServer).listen(config.devServer.port, (err) => {
      if (err) console.log(err)
    });
    return;
  }
  compiler.run(handlerErr);
}

function mergeConfig(argv) {
  const configPath = argv.config || './cfn.config.json';
  console.log(`config path is ${configPath}`);
  fs.readFile(configPath, (err, data) => {
    if (err) throw new Error(err);
    const configObj = JSON.parse(data);
    if (typeof configObj.entry === 'string') {
      const config = merge(devConfig, { plugins: [
        new HtmlWebpackPlugin({
          title: '',
          filename: 'index.html',
          inlineSource: '.(js|css)$'
        })]
      }, configObj);
      console.log(`webpack config created`);

      run(config, true);
    } else if (Array.isArray(configObj.entry)) {
      throw new Error('entry is invalid')
    } else if (typeof configObj.entry === 'object') {
      const plugins = Object.keys(configObj.entry).map(e => new HtmlWebpackPlugin({
        title: '',
        filename: `${e}.html`,
        inlineSource: '.(js|css)$',
        chunks: [e]
      }));
  
      const config = merge(prodConfig, { plugins }, configObj);
      console.log(`webpack config created`);

      run(config);
    }
  })
}

exports.handler = function (argv) {
  mergeConfig(argv);
}
