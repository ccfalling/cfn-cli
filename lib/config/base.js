const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const cwd = process.cwd()

module.exports = {
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{
    test: /\.jsx?$/,
      exclude: [
        path.resolve(cwd, "node_modules")
      ],
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [
          // Stage 0
          "@babel/plugin-proposal-function-bind",

          // Stage 1
          "@babel/plugin-proposal-export-default-from",
          "@babel/plugin-proposal-logical-assignment-operators",
          ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
          ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
          ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
          "@babel/plugin-proposal-do-expressions",

          // Stage 2
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
          "@babel/plugin-proposal-function-sent",
          "@babel/plugin-proposal-export-namespace-from",
          "@babel/plugin-proposal-numeric-separator",
          "@babel/plugin-proposal-throw-expressions",

          // Stage 3
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-syntax-import-meta",
          ["@babel/plugin-proposal-class-properties", { "loose": true }],
          "@babel/plugin-proposal-json-strings"
        ]
      },
    },{
    test: /\.vue$/,
      exclude: [
        path.resolve(cwd, "node_modules")
      ],
      loader: "vue-loader",
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
      test: /\.styl(us)?$/,
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
    }, {
      test: /\.(jpg|png|gif|bmp|jpeg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 9999,
          quality: 85,
          name: '[name].[ext]?[contenthash]'
        }
      }, {
        loader: 'image-webpack-loader',
        options: {
          disable: true,
          mozjpeg: {
            progressive: true,
            quality: 65
          },
          // optipng.enabled: false will disable optipng
          optipng: {
            enabled: false,
          },
          pngquant: {
            quality: [0.65, 0.90],
            speed: 4
          },
          gifsicle: {
            interlaced: false,
          },
          // the webp option will enable WEBP
          // webp: {
          //   quality: 75
          // }
        }
      }]
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[contenthash]'
      }
    },]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
  ],
  resolve: {
    extensions: [".js", ".json", ".jsx", ".vue"],
  }
}
