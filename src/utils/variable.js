/**
 * @author LiuLang
 * @date 2019/03/11
 * @description 定义公共变量
 */

import bus from './bus'

const variable = {
  install (Vue) {
    Vue.$bus = Vue.prototype.$bus = bus
  }
}

export default variable
