var webpack = require("webpack");

module.exports = {
    entry: __dirname + "/www/js/main",
    resolve: {
        modulesDirectories: [
            "."
        ]
    },
    output: {
        path: __dirname + "/dist/www/js/",
        filename: "main.js"
    }
};