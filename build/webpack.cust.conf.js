'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackConfig = require('./webpack.prod.conf')
let path = require('path')
const chalkLog = require('../tools/chalkLog')

// exports function 能接收参数
module.exports = function(env, argv){
  // 根据 npm run script 传入的参数判断环境
  let apiEnv = env.serverApi || 'dev';

  // console.log(env.serverApi, 'serverApi');
  
  if (apiEnv === 'prod') {  // 线上环境提示
    chalkLog({
      color: 'blue',
      badge: '📦📦📦',
      tag: 'Bundling',
      msg: 'Server api ENV: online'
    })
  } else {
    chalkLog({
      color: 'blue',
      badge: '📦📦📦',
      tag: 'Bundling',
      msg: ('Server api ENV: '+ apiEnv)
    })
  }

  // 如果环境为 dev ，不必替换 config 文件
  if (apiEnv === 'dev'){
    return webpackConfig
  }

  // 服务端接口配置文件
  const confMap = {
    qa: path.resolve(__dirname, '../src/services/config-qa.js'),
    pre: path.resolve(__dirname, '../src/services/config-pre.js'),
    prod: path.resolve(__dirname, '../src/services/config-prod.js')
  }
  // 找到相应的配置文件
  let servicesConf = confMap[apiEnv]

  const prodWebpackConfig = merge(webpackConfig, {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /services\/config\.js/, // services 目录默认配置文件
        servicesConf  // 替换配置文件，可以写相对目录
      )
    ]
  })

  return prodWebpackConfig
}