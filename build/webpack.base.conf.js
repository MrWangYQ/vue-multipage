'use strict'

var path = require('path')
const webpack = require('webpack')
const glob = require('glob')
// const autoprefixer = require('autoprefixer')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const vuxLoader = require('vux-loader')

const extractCSS = new ExtractTextPlugin({
  // filename: 'assets/css/[name].css',
  filename: (getPath) => {
    return getPath('assets/css/[name].css').replace('views/', '');
  },
  allChunks: true
})
const extractLESS = new ExtractTextPlugin({
  // filename: 'assets/css/[name].css',
  filename: (getPath) => {
    return getPath('assets/css/[name].css').replace('views/', '');
  },
  allChunks: true
})
const extractSASS = new ExtractTextPlugin({
  // filename: 'assets/css/[name].css',
  filename: (getPath) => {
    return getPath('assets/css/[name].css').replace('views/', '');
  },
  allChunks: true
})

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const entries = {}
const chunks = []
const htmlWebpackPluginArray = []

// 子页面入口为 app.js
// 子页面模版为 app.html
glob.sync('./src/pages/**/app.js', {
  // 忽略项目模板目录
  ignore: ['./src/pages/singlePage/**', './src/pages/multiPage/**']
}).forEach(path => {
  const _chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  const chunk = _chunk.replace('views/', '')

  entries[chunk] = path
  chunks.push(chunk)

  let filename = chunk + '.html'
  // 去掉 views 目录
  filename = filename.replace('views/', '')

  const htmlConf = {
    filename: filename,
    template: path.replace(/.js/g, '.html'),
    inject: 'body',
    // favicon: './src/assets/images/beacon.ico',
    hash: true,
    chunks: ['commons', chunk]
  }
  htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
})

const styleLoaderOptions = {
  loader: 'style-loader',
  options: {
    sourceMap: true
  }
}
const cssOptions = [
  { loader: 'css-loader', options: { sourceMap: true } },
  { loader: 'postcss-loader', options: { sourceMap: true } }
]
const lessOptions = [...cssOptions, {
  loader: 'less-loader',
  options: {
    sourceMap: true
  }
}]

const sassOptions = [...cssOptions, {
  loader: 'sass-loader',
  options: {
    sourceMap: true
  }
}]

const px2rem = require('postcss-plugin-px2rem');

const config = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, '../dist/beacon/'),
    filename: 'assets/js/[name].js',
    publicPath: '/beacon/' // 线上环境需要添加 /beacon/ 目录
  },
  resolve: {
    extensions: ['.js', '.vue', '.less', '.scss'],
    alias: {
      vue: 'vue/dist/vue.js',
      vuex: 'vuex/dist/vuex.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: cssOptions,
              fallback: styleLoaderOptions
            })),
            less: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: lessOptions,
              fallback: styleLoaderOptions
            })),
            postcss: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: cssOptions,
              fallback: styleLoaderOptions
            })),
            scss: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: sassOptions,
              fallback: styleLoaderOptions
            }))
          },
          postcss: function () {
            return [
              px2rem({ rootValue: 37.5 }),
              // autoprefixer
            ];
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: cssOptions,
          fallback: styleLoaderOptions
        }))
      },
      {
        test: /\.less$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: lessOptions,
          fallback: styleLoaderOptions
        }))
      },
      {
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: sassOptions,
          fallback: styleLoaderOptions
        }))
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            root: resolve('src'),
            attrs: ['image:src', 'link:href']
          }
        }]
      },
      { // 处理图片
        test: /\.(png|jpg|jpeg|gif|svg)(\?.+)?$/,
        exclude: /favicon\.png$/,
        // exclude: resolve('src/assets/images'),
        // exclude: [path.join(__dirname, '../src/assets/images')],
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240, // 小于10k为 base64 图片，大于10k使用 file-loader 解析，生成 assets/images 目录
            name: 'assets/images/[name].[hash:7].[ext]'
          }
        }]
      },
      { // 图片压缩
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'image-webpack-loader',
        options: {
          bypassOnDebug: true
        }
      },
      { // 处理字体
        test: /\.(eot|ttf|woff|woff2|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: 'assets/fonts/[name].[hash:7].[ext]'
          }
        }]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 3,
          name: 'commons',
          enforce: true
        }
      }
    }
  },
  performance: {
    hints: false
  },
  stats: {  // 命令行日志信息
    // assets: true,
    // builtAt: true,
    // errors: true,
    // errorDetails: true,
    children: false,
    entrypoints: false,
    modules: false,
    moduleTrace: false,
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    extractLESS,
    extractSASS,
    extractCSS,
  ]
}
config.plugins = [...config.plugins, ...htmlWebpackPluginArray]

//vux
module.exports = vuxLoader.merge(config, {
  plugins: ['vux-ui']
})
