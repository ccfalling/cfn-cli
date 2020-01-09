const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const cwd = process.cwd()

module.exports = {
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
        exclude: [
          path.resolve(cwd, "node_modules")
        ],
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env'],
          plugins: []
        },
    }, {
      test: /\.(less|css)$/,
        exclude: [
          path.resolve(cwd, "node_modules")
        ],
        loader: [
          'style-loader', 'css-loader',
          { 
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
                require('cssnano')()
              ]
            }
          }, 
          'less-loader'
        ],
    }, {
      test: /\.scss$/,
        exclude: [
          path.resolve(cwd, "node_modules")
        ],
        use: ['sass-loader', 'css-loader', { 
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: (loader) => [
              require('postcss-import')({ root: loader.resourcePath }),
              require('postcss-preset-env')(),
              require('cssnano')()
            ]
          }
        }, 'stylus-loader'],
    }, {
      test: /\.styl$/,
        exclude: [
          path.resolve(cwd, "node_modules")
        ],
        use: ['style-loader', 'css-loader',{ 
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: (loader) => [
              require('postcss-import')({ root: loader.resourcePath }),
              require('postcss-preset-env')(),
              require('cssnano')()
            ]
          }
        }, 'stylus-loader'],
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
}