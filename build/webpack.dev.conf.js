'use strict'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8000,
    historyApiFallback: false,
    //热更新配置；
    hot: true,
    stats: { // 命令行日志信息
      children: false,
      entrypoints: false,
      modules: false,
      moduleTrace: false,
    },
    proxy: {
      '/api': {
        target: 'http://10.0.5.219',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    },
    open: true,
    openPage: 'beacon/fission.html',
    //热更新配置；
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
  }
})

module.exports = devWebpackConfig