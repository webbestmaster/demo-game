var webpack = require("webpack");

module.exports = {
    entry: __dirname + "/www/js/main",
    resolve: {
        modulesDirectories: [
            ""
        ],
        alias: {
            //'Deferred': "./js/deferred"
        }
    },
    output: {
        path: __dirname + "/dist/www/js/",
        filename: "main.js",
        publicPath: "./js/"
    }
};