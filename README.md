# cfn-cli
构建web单页，cfn-cli使用了[html-webpack-inline-source-plugin](https://www.npmjs.com/package/html-webpack-inline-source-plugin),
在构建代码时，js、css会内联进html，支持vue、react。

# install
    npm i cfn-cli -g -D
  
# command
## web
代表构建web单页，output在当前目录下的dist文件

# option
## entry
    cfn-cli web --entry $filepath
只支持一个入口，生成一个单页，适用场景为新增单个页面的开发、构建


## config
    cfn-cli web --config $filepath
一个入口配置文件，文件只支持json格式,构建配置中所有页面,使用配置文件模式会构建配置中所有页面

    config.json
    {
      home: './src/home.js',
      prod: './src/prod.js'
    }
    cfn-cli web --config ./config.json

## watch
    cfn-cli web --entry ./src/index.js --watch

建立webpack-dev-server的服务，默认端口8001

