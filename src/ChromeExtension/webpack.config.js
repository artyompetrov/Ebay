const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const backendDomain = process.env.EBAY_HELPER_BACKEND_DOMAIN;
if (!backendDomain) { throw new Error('EBAY_HELPER_BACKEND_DOMAIN is required'); }
module.exports = {
    entry: {
        ebay: "./src/main.ts",
        options: "./src/options.ts",
        background: "./src/background.ts"
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
    // The content script is injected into every page at document_start, so ship it without the inline source map
    // the development mode adds (about 4x the size). It stays unminified: stack traces in exported error logs must
    // stay readable.
    mode: 'production',
    devtool: false,
    optimization: {
        minimize: false
    },
    // Unminified bundles exceed webpack's web-page size hints; the content script size is tracked in the PR instead.
    performance: {
        hints: false
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            EBAY_HELPER_BACKEND_DOMAIN: JSON.stringify(backendDomain)
        })
    ]
};
