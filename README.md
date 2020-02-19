# cfn-cli
构建web单页，cfn-cli使用了[html-webpack-inline-source-plugin](https://www.npmjs.com/package/html-webpack-inline-source-plugin),
在构建代码时，js、css会内联进html，支持vue、react。

# install
    npm i cfn-cli -g -D
  
# command
## web
    cfn-cli web
代表构建web单页，output在当前目录下的dist文件，默认配置文件为命令行所在目录下的cfn.config.json文件，与[webpack](http://webpack.github.io/)配置项相同

# option
## config
    cfn-cli web --config ./config.json
提供一个入口配置文件，文件只支持json格式,构建配置中所有页面,使用配置文件模式会构建配置中所有页面

当入口配置项为字符串时，使用webpack-dev-server启动开发模式，默认端口8001
    config.json
    {
      entry: './src/home.js',
    }
    cfn-cli web --config ./config.json

当入口配置项为对象时，使用生产环境构建模式
    config.json
    {
        entry: {
            home: './src/home.js',
            prod: './src/prod.js'
        }
    }


