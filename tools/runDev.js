let shell = require('shelljs');
const glob = require('glob')

let params = process.argv

let enableMock = false  // 是否启用 mock
if (params.includes('--mock')) {
  enableMock = true
}

// 支持传入起始页，示例：npm start -- --index=customer
let indexPage = params.find(function(it) {
  return it.indexOf('--index=') > -1  // 找到起始页标识
})

if (indexPage) {
  let indexPath = indexPage.split('--index=')[1]

  let pagePath = glob.sync('./src/pages/'+ indexPath +'/app.js')
  if (pagePath.length) {
    // 单页应用
    indexPage = 'beacon/'+ indexPath +'.html'
  } else {
    // 多页应用
    indexPage = 'beacon/'+ indexPath +'/index.html'
  }
} else {
  indexPage = 'beacon/fission.html' // 不传参数，默认起始页面
}

let script = 'webpack-dev-server --open-page='+ indexPage +' --inline --hot --config build/webpack.dev.conf.js'
if (enableMock) {
  script = 'webpack-dev-server --open-page='+ indexPage +' --inline --hot --config build/webpack.mock.conf.js'
}

shell.exec(script)