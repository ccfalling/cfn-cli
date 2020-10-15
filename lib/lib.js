const webpack = require('webpack');
const prodConfig = require('./config/lib-prod');
const devConfig = require('./config/lib-dev');
const merge = require('webpack-merge')
const WebpackDevServer = require('webpack-dev-server');
const utils = require('./utils');

exports.command = 'lib';
exports.describe = 'build libs';
exports.builder = {
 
}
/**
 * webpack错误捕获
 * @param {*} err 
 * @param {*} stats 
 */
exports.handler = function (argv) {
    let defaultWebpackConfig = {
        devServer: {
            port: 4300,
            proxy: {
                '/api': {
                    target: 'http://api.accountcenter.staff.dreame.com',
                    secure: false,
                    changeOrigin: true,
                    pathRewrite: {'^/api' : ''}
                }
            }
        }
    }
    if (argv.config) {
        utils.getWebpackConfig(argv.config).then((res) => {
            build(res, argv.dev);
        })
    } else {
        build(defaultWebpackConfig, argv.dev);
    }
}

function build(webpackConfig, isDev) {
    if (isDev) {
        const mergedConfig = merge(devConfig, webpackConfig);
        const compiler = webpack(mergedConfig);
        const dev = new WebpackDevServer(compiler, mergedConfig.devServer);
        dev.listen(mergedConfig.devServer.port, (err) => {
            if (err) console.log(err)
        });
        return;
    }
    const compiler = webpack(merge(prodConfig, webpackConfig));
    compiler.run(handlerErr);
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
      assets: true,
      cached: false,
      // children: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      hash: true,
      modules: false,
      // reasons: false,
      // source: false,
      // timings: true,
      // version: true,
      logging: 'info'
    });
    console.log(out);
  }