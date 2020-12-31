'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const devWebpackConfig = require('./webpack.dev.conf')

module.exports = function (env, argv) {
  const devMockWebpackConfig = merge(devWebpackConfig, {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /services\/config\.js/, // services 目录默认配置文件
        './config-mock.js'  // 替换配置文件，可以写相对目录
      )
    ],
    devServer: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:4000',
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        }
      }
    }
  })
  return devMockWebpackConfig
}
