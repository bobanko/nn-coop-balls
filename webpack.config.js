'use strict';

const webpack = require('webpack');// need to be installed locally npm i webpack
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractLESS = new ExtractTextPlugin('[name].css');

module.exports = {

    //custom entry/output
    entry: './src/ai_coop.ts', //base js file path

    output: {
        //path: '/dist/',
        //publicPath: './dist/',
        //library: '[name]',

        filename: './dist/bundle.js',
        //filename: 'dist/[name].bundle.js',
    },

    // watch: true,
    //
    // watchOptions: {
    // 	aggregateTimeout: 100 //wait after changes //300 default
    // },


    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "less-loader", options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],
    },

    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    devtool: 'inline-source-map',

    plugins: [
        //extractLESS
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'nn coop balls',
            template: './src/index.html',
        })
    ],

    devServer: {
        //host: 'localhost', //default
        //port: 8080, //default
        contentBase: './dist',
        hot: true,
    }

};