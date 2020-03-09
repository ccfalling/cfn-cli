# cfn-cli
构建web单页，cfn-cli使用了[html-webpack-inline-source-plugin](https://www.npmjs.com/package/html-webpack-inline-source-plugin),
在构建代码时，js、css会内联进html，支持vue、react。

# install
    npm i cfn-cli -g -D
  
# command
## web
    cfn-cli web
代表构建web单页，output在当前目录下的dist文件，默认配置文件为命令行所在目录下的cfn.config.json（仅json类型）文件，与[webpack](http://webpack.github.io/)配置项相同。

# option
## page p
    cfn-cli web --page
    cfn-cli web --p test
指定需要构建的文件夹，默认入口为指定文件夹的index.js，此选项默认开启dev模式

## config c
    cfn-cli web --config ./config.json
    cfn-cli web --c ./config.json
提供一个入口配置文件，构建配置中所有页面,使用配置文件模式会构建配置中所有页面

## dev d
    cfn-cli web --dev
    cfn-cli web --d
    cfn-cli web --c ./config.json -d
开始开发者模式，以webpack-dev-server 启动开发者模式，与config选项一起使用，可以自定义配置启动开发者模式