'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const prodWebpackConfig = merge(baseWebpackConfig, {
  devtool: '#source-map',
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }), // 编译前删除 dist 目录
    new OptimizeCSSPlugin()
  ]
})

module.exports = prodWebpackConfig