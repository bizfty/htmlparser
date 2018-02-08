const webpack = require('webpack');
const path = require("path");
module.exports = function(options){
    return {
//页面入口文件配置
        entry: {
            'htmlparser':'./index.ts',
        },
        devtool: 'inline-source-map',
//入口文件输出配置
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name].js'
        },
        resolve: {
            extensions: [ '.ts', '.js', 'json']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: 'tsconfig.webpack.json'
                            }
                        }
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/,/node_modules/]
                },
                {
                    test: /\.js$/,
                    //exclude: /(node_modules|bower_components)/,
                    use: {
                        loader:'babel-loader',
                        options:{
                            cacheDirectory:true
                        }
                    }
                },
                {
                    test: /\.json$/,
                    use: 'json-loader'
                }
            ]
        }
    };
};
