var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: __dirname + "/www/js/main",
    resolve: {
        modulesDirectories: [
            ""
        ]
    },
    output: {
        path: __dirname + "/build/js/",
        filename: "main.js",
        publicPath: "./js/"
    },
    context: "www",
    plugins: [
        new CopyWebpackPlugin([{
            from: 'i/',
            to: './../i'
        }, {
            from: 'hi/',
            to: './../hi'
        }, {
            from: 'css/',
            to: './../css'
        }]),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ]
};