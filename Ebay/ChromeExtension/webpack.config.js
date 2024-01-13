const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const path = require("path");
module.exports = {
    entry: "./main.ts",
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
        path: path.resolve(__dirname, "../dist"),
        filename: "bundle.js"
    },
    mode: 'production',
    plugins: [ new CleanWebpackPlugin() ]
};