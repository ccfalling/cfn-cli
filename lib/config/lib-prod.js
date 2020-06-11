const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const cwd = process.cwd();

module.exports = {
    mode: "production",
    output: {
        path: path.resolve(cwd, 'lib'),
        publicPath: '/',
        filename: '[name].js',
        libraryTarget: 'umd'
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
                    'css-loader', 'postcss-loader'
                ],
            }, {
                test: /\.less$/,
                exclude: [
                    path.resolve(cwd, "node_modules")
                ],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                })
            }, {
                test: /\.styl(us)?$/,
                exclude: [
                    path.resolve(cwd, "node_modules")
                ],
                use: ['css-loader', 'postcss-loader', 'stylus-loader'],
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
        new ExtractTextPlugin("styles.css"),
    ],
}
