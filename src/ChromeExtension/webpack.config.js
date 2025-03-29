const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const path = require("path");
module.exports = {
    entry: "./src/main.ts",
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, "./_extension/build/"),
        filename: "ebay.js"
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [ new CleanWebpackPlugin() ]
};