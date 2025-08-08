const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const backendDomain = process.env.EBAY_HELPER_BACKEND_DOMAIN;
const ebayClientId = process.env.EBAY_CLIENT_ID;
const ebayClientSecret = process.env.EBAY_CLIENT_SECRET;
const ebayRedirectUriCode = process.env.EBAY_REDIRECT_URI_CODE;
if (!backendDomain) { throw new Error('EBAY_HELPER_BACKEND_DOMAIN is required'); }
if (!ebayClientId) { throw new Error('EBAY_CLIENT_ID is required'); }
if (!ebayClientSecret) { throw new Error('EBAY_CLIENT_SECRET is required'); }
if (!ebayRedirectUriCode) { throw new Error('EBAY_REDIRECT_URI_CODE is required'); }
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
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            EBAY_HELPER_BACKEND_DOMAIN: JSON.stringify(backendDomain),
            EBAY_CLIENT_ID: JSON.stringify(ebayClientId),
            EBAY_CLIENT_SECRET: JSON.stringify(ebayClientSecret),
            EBAY_REDIRECT_URI_CODE: JSON.stringify(ebayRedirectUriCode)
        })
    ]
};
