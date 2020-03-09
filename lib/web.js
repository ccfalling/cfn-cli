const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const fs = require('fs');
const merge = require('webpack-merge')
const devConfig = require('./config/dev');
const prodConfig = require('./config/prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const glob = require('glob');

exports.command = 'web';
exports.describe = 'build mult entry html page';
exports.builder = {
  config: {
    alias: 'c',
    default: './cfn.config.json'
  },
  page: {
    alias: 'p',
  },
  dev: {
    alias: 'd',
    default: false
  }
}
/**
 * webpack错误捕获
 * @param {*} err 
 * @param {*} stats 
 */
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


/**
 * 启动webpack
 * @param {*} config webpack config
 * @param {*} isDev 是否用webpack-dev-server启动
 */
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

/**
 * 读取配置文件启动
 * @param {*} filepath 
 * @param {*} isDev 
 */
function readConf(filepath, isDev) {
  if (path.extname(filepath) !== '.json') {
    throw new Error('configuration file must be a json file')
  }

  // resolve the absolute path
  let configPath = filepath;
  if (!path.isAbsolute(configPath)) {
    const cwd = process.cwd();
    configPath = path.resolve(cwd, filepath);
  }

  // read the json file
  fs.readFile(configPath, (err, data) => {
    if (err) throw new Error(err);
    
    const configObj = JSON.parse(data);
    if (!isDev && typeof configObj.entry !== 'object') {
      throw new Error(`configuration's entry option must be object`);
    }

    const configDirPath = path.dirname(configPath);
    Object.keys(configObj.entry).forEach(e => {
      configObj.entry[e] = path.resolve(configDirPath, configObj.entry[e])
    });

    const plugins = Object.keys(configObj.entry).map(e => new HtmlWebpackPlugin({
      title: '',
      filename: `${e}.html`,
      inlineSource: '.(js|css)$',
      chunks: [e]
    }));
  
    const config = merge(prodConfig, configObj, { plugins });
    console.log(`webpack config created`);

    run(config, isDev);
  })
}

function runDevServer(entry) {
  const config = merge(devConfig, {
    entry,
    plugins: [
      new HtmlWebpackPlugin({
        title: '',
        filename: 'index.html',
        inlineSource: '.(js|css)$'
      })
    ]
  });
  console.log(`webpack config created`);

  run(config, true);
}


/**
 * 合并自定义配置
 * @param {*} argv 
 */
function mergeConfig(argv) {
  // cli配置启动
  if (argv.page) {
    const cwd = process.cwd();

    if (path.extname(argv.page)) {
      runDevServer(path.resolve(cwd, argv.page))
      return;
    }

    glob(`**/${argv.page}/index.js`, { absolute: true }, function (err, files) {
      if (err) throw new Error(JSON.stringify(err));
      if (!files || !files.length) throw new Error('can not match any file');
      runDevServer(files[0])
    })
  } else {
    readConf(argv.config, argv.dev);
  }
}

exports.handler = function (argv) {
  mergeConfig(argv);
}
