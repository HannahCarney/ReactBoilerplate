"use strict";

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const sourcePath = path.resolve(__dirname, '..', 'src');
const buildPath = path.resolve(__dirname, '..', 'dist');

const packageJson = require('../package.json');

module.exports = (configLocation) => ({
    entry: {
        index: path.resolve(sourcePath, 'index.js')
    },
    output: {
        path: buildPath,
        publicPath: '/',
        filename: '[name].[chunkhash].bundle.js'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: ['file-loader'],
                include: [
                    path.resolve(sourcePath, 'assets', 'fonts'),
                    /node_modules\/font-awesome/
                ]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                }),
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|svg)/,
                use: ['file-loader'],
                include: path.resolve(sourcePath, 'assets', 'img')
            }
        ]
    },
    resolve: {
        alias: {
            config: configLocation
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(sourcePath, 'index.html'),
            path: buildPath,
            chunks: ['index'],
            filename: 'index.html',
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: sourcePath
            }
        }),
        new ExtractTextPlugin('styles.[chunkhash].css'),
        new webpack.DefinePlugin({
            __APP_NAME__: `'${packageJson.name}'`
        })
    ],
    devServer: {
        historyApiFallback: true,
        headers: {
            "Access-Control-Allow-Origin": "http://10.0.2.2:8082",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    }
});