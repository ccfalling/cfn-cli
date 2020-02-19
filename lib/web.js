const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const fs = require('fs');
const merge = require('webpack-merge')
const devConfig = require('./config/dev');
const prodConfig = require('./config/prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

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
  const out = stats.toString({
    // assets: true,
    // cached: false,
    // children: false,
    // chunks: false,
    // chunkModules: false,
    colors: true,
    // hash: true,
    // modules: false,
    // reasons: false,
    // source: false,
    // timings: true,
    // version: true,
    logging: 'info'
  });
  console.log(out);
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
  const cwd = process.cwd()
  const configPath = argv.config || './cfn.config.json';
  const configAbsPath = path.dirname(path.resolve(cwd, configPath));
  console.log(`config is in ${configAbsPath}`);
  fs.readFile(configPath, (err, data) => {
    if (err) throw new Error(err);
    const configObj = JSON.parse(data);
    if (typeof configObj.entry === 'string') {
      configObj.entry = path.resolve(configAbsPath, configObj.entry);
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
      Object.keys(configObj.entry).forEach(e => {
        configObj.entry[e] = path.resolve(configAbsPath, configObj.entry[e])
      });

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
