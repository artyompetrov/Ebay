const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const backendDomain = process.env.EBAY_HELPER_BACKEND_DOMAIN;
if (!backendDomain) { throw new Error('EBAY_HELPER_BACKEND_DOMAIN is required'); }
module.exports = {
    entry: {
        ebay: "./src/main.ts",
        options: "./src/options.ts"
    },
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
        filename: "[name].js"
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            EBAY_HELPER_BACKEND_DOMAIN: JSON.stringify(backendDomain)
        })
    ]
};
