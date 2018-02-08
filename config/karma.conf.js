// Karma configuration
// Generated on Mon Feb 05 2018 09:46:45 GMT+0800 (中国标准时间)

module.exports = function(config) {
  var testWebpackConfig = require('./webpack.test.js')({ env: 'test' });

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        { pattern: './config/spec-bundle.js', watched: false,served: true, included: true },
        //{ pattern: './src/assets/**/*', watched: false, included: false, served: true, nocache: false }
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha','coverage','remap-coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    coverageReporter:{
        type:'in-memory'
    },
    remapCoverageReporter: {
        json: './coverage/coverage.json',
        html: './coverage/html'
      },
    webpack: testWebpackConfig,
    webpackMiddleware:{
        /**
         * webpack-dev-middleware configuration
         * i.e.
         */
        noInfo: true,
        /**
         * and use stats to turn off verbose output
         */
        stats: {
            /**
             * options i.e.
             */
            chunks: false
        }
    }
  })
}
