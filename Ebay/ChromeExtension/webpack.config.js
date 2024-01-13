const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const path = require("path");
module.exports = {
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "bundle.js"
    },
    mode: 'production',
    plugins: [ new CleanWebpackPlugin() ]
};