const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const commonConfig = require('./webpack.common.js');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
module.exports = function (options) {
    return webpackMerge(commonConfig({env: ENV}),{
        devtool: 'source-map',
        plugins:[
            new OptimizeJsPlugin({
                sourceMap: false
            }),
            new UglifyJsPlugin({
                sourceMap: false,
                uglifyOptions: {
                    ie8: false,
                    ecma: 8,
                    output: {
                        comments: false,
                        beautify: false
                    },
                    warnings: false
                }
            })
        ]
    });
};
