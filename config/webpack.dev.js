const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
module.exports = function (options) {
    return webpackMerge(commonConfig({env: ENV}),{
        devtool: 'cheap-module-source-map'
    });
};

