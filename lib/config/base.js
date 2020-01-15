const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

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
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-optional-chaining']
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
    }, {
      test: /\.(jpg|png|gif|bmp|jpeg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 9999,
          quality: 85,
        }
      },{
        loader: 'image-webpack-loader',
        options: {
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
          webp: {
            quality: 75
          }
        }
      },],
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
  ]
}