var path = require('path'),
    webpack = require('webpack');

var config = {
    entry: {
        imagePreloader: './src/'
    },
    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: '[name].min.js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    devtool: 'source-map'
};

module.exports = config;
