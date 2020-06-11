const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const merge = require('webpack-merge')
const devConfig = require('./config/dev');
const prodConfig = require('./config/prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const glob = require('glob');
const utils = require('./utils');

const templateContent = `
    <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,minimum-scale=1.0">
            <title></title>
            </head>
            <body>
            <noscript>
                <strong>We're sorry but this page doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
            </noscript>
            <div id="app"></div>
            <!-- built files will be auto injected -->
            </body>
        </html>
`;



exports.command = 'web';
exports.describe = 'build mult entry html page';
exports.builder = {
    config: {
        alias: 'c',
        default: './cfn.config.js'
    },
    page: {
        alias: 'p',
    },
    dev: {
        alias: 'd'
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
    if (isDev) {
        const mergedConfig = merge(devConfig, config);
        const compiler = webpack(mergedConfig);
        const dev = new WebpackDevServer(compiler, mergedConfig.devServer);
        dev.listen(mergedConfig.devServer.port, (err) => {
            if (err) console.log(err)
        });
        return;
    }
    const compiler = webpack(merge(prodConfig, config));
    compiler.run(handlerErr);
}



// /**
//  * 获取自定义配置
//  * @param {String} filePath 配置文件路径
//  */
// function getConfig(filePath) {
//     // 检查文件路径为绝对路径
//     let configPath = filePath;
//     if (!path.isAbsolute(configPath)) {
//         const cwd = process.cwd();
//         configPath = path.resolve(cwd, filePath);
//     }
//     return new Promise((resolve, reject) => {
//         // 文件不存在 return
//         if (!fs.existsSync(configPath)) {
//             resolve({});
//             return;
//         }

//         // 配置文件为js
//         if (path.extname(configPath) === '.js') {
//             const config = require(configPath);
//             resolve(config);
//         }
//         // 配置文件为json
//         if (path.extname(configPath) === '.json') {
//             fs.readFile(configPath, (err, data) => {
//                 if (err) reject(err);
//                 const configObj = JSON.parse(data);
//                 resolve(configObj)
//             })
//         }
//         reject('config type is invalid');
//     })
// }

/** 解析cli命令
 * @param {Object} argv
 */
exports.handler = function (argv) {
    // 获取自定义配置
    utils.getWebpackConfig(argv.config).then(res => {
        const { htmlPlugins, ...selfConf } = res;
        const devHtmlPluginConfig = {
            title: '',
            templateContent,
            inlineSource: '.(js|css)$',
            hash: true
        };

        // cli配置启动
        const page = argv.page;
        if (page && path.extname(page)) {
            const cwd = process.cwd();
            const entry = path.isAbsolute(argv.page) ? argv.page : path.resolve(cwd, argv.page);
            selfConf.entry = entry;
            const htmlwebpack = new HtmlWebpackPlugin(devHtmlPluginConfig);
            selfConf.plugins = selfConf.plugins ? selfConf.plugins.concat(htmlwebpack) : [htmlwebpack];
            run(selfConf, argv.dev);
        } else if (page) {
            glob(`**/${argv.page}/index.js`, { absolute: true }, function (err, files) {
                if (err) throw new Error(JSON.stringify(err));
                if (!files || !files.length) throw new Error('can not match any file');
                selfConf.entry = { [page]: files[0] };
                // 设置html插件
                const pagePlugin = htmlPlugins && htmlPlugins.find(e => e.filename === `${page}.html`);
                const defaultHtmlConfig = argv.dev ? devHtmlPluginConfig : (pagePlugin || {
                    title: '',
                    filename: `${page}.html`,
                    templateContent,
                    inlineSource: '.(js|css)$',
                    chunks: [page],
                    hash: true
                });
                const htmlwebpack = new HtmlWebpackPlugin(defaultHtmlConfig)
                selfConf.plugins = selfConf.plugins ? selfConf.plugins.concat(htmlwebpack) : [htmlwebpack];

                run(selfConf, argv.dev)
            });
        } else {
            let htmls = [];
            if (typeof selfConf.entry === 'object') {
                Object.keys(selfConf.entry).forEach(e => {
                    if (htmlPlugins && !htmlPlugins.some(hp => hp.filename === `${e}.html`)) {
                        htmls.push(new HtmlWebpackPlugin({
                            title: e,
                            filename: `${e}.html`,
                            templateContent,
                            inlineSource: '.(js|css)$',
                            chunks: [e],
                            hash: true
                        }));
                    }
                })
                htmlPlugins && (htmls = htmls.concat(htmlPlugins.map(e => {
                    // 重置hash选项
                    if (!e.inlineSource) {
                        e.hash = true;
                    }
                    return new HtmlWebpackPlugin(e);
                })));
            }
            selfConf.plugins = selfConf.plugins ? selfConf.plugins.concat(htmls) : htmls;

            run(selfConf);
        }
    })
}
