const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BaseConfig = require('./webpack.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = merge(BaseConfig, {
  mode: 'development',
  plugins:[
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html'
    })
    // new BundleAnalyzerPlugin(),
  ]
})