# cfn-cli
构建web单页，cfn-cli使用了[html-webpack-inline-source-plugin](https://www.npmjs.com/package/html-webpack-inline-source-plugin),
在构建代码时，js、css会内联进html，支持vue、react。

# install
    npm i cfn-cli -g -D
  
# command
## web
    cfn-cli web
代表构建web单页，output在当前目录下的dist文件，默认配置文件为命令行所在目录下的cfn.config.js（或者cfn.config.json类型）文件，与[webpack](http://webpack.github.io/)配置项相同。
htmlplugin的配置需要单独写在htmlPlugins下:
    {
        ...,
        htmlPlugins: [
        {
            title: 'title',
            template: 'index.html',
            filename: 'test.html',
            chunks: ['test'],
        },
        {
            ...
        },
    ],
    }

# option
## page p
    cfn-cli web --page test
    cfn-cli web --p test
指定需要构建的文件夹，默认入口为指定文件夹的index.js

## config c
    cfn-cli web --config ./config.json
    cfn-cli web --c ./config.json
提供一个入口配置文件，使用配置指定配置替换默认配置

## dev d
    cfn-cli web --dev
    cfn-cli web -p test --d
    cfn-cli web --c ./config.json -d
开启开发者模式，以webpack-dev-server 启动开发者模式