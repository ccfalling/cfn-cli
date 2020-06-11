const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const cwd = process.cwd();

module.exports = {
    mode: "development",
    entry: './example.ts',
    output: {
        path: path.resolve(cwd, 'dist'),
        publicPath: '/',
        filename: 'js/[name].js',
    },
    module: {
        rules: [
            {
            test: /\.tsx?$/,
            exclude: [
                path.resolve(cwd, "node_modules")
            ],
            loader: "babel-loader",
            options: {
                presets: [[
                            "@babel/preset-env",
                            {
                                "useBuiltIns": "usage",
                                "corejs": {
                                    "version": 3,
                                    "proposals": true
                                }
                            }
                        ], '@babel/preset-react', '@babel/preset-typescript'],
                plugins: [
                    // Stage 0
                    "@babel/plugin-proposal-function-bind",

                    // // Stage 1
                    "@babel/plugin-proposal-export-default-from",
                    "@babel/plugin-proposal-logical-assignment-operators",
                    ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
                    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
                    ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
                    "@babel/plugin-proposal-do-expressions",

                    // // Stage 2
                    ["@babel/plugin-proposal-decorators", { "legacy": true }],
                    "@babel/plugin-proposal-function-sent",
                    "@babel/plugin-proposal-export-namespace-from",
                    "@babel/plugin-proposal-numeric-separator",
                    "@babel/plugin-proposal-throw-expressions",

                    // // Stage 3
                    "@babel/plugin-syntax-dynamic-import",
                    "@babel/plugin-syntax-import-meta",
                    ["@babel/plugin-proposal-class-properties", { "loose": true }],
                    "@babel/plugin-proposal-json-strings",

                    "@babel/plugin-proposal-object-rest-spread",
                    ]
                },
            }, {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader','postcss-loader',
                ],
            }, {
                test: /\.less$/,
                exclude: [
                    path.resolve(cwd, "node_modules")
                ],
                use: [
                    'style-loader', 'css-loader', 'postcss-loader', 'less-loader'
                ],
            }, {
                test: /\.styl(us)?$/,
                exclude: [
                    path.resolve(cwd, "node_modules")
                ],
                use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader'],
            }, {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                    limit: 9999,
                    quality: 85,
                    name: 'imgs/[name].[ext]?[contenthash]'
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
    resolve: {
        extensions: [".js", ".json", ".jsx", ".ts"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(),
    ]
}
