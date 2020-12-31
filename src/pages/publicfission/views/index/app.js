import Vue from 'vue'
import '@/utils/flexible'
import '@/assets/css/reset.scss'
import Axios from '@/services';
import App from './app.vue'

Vue.prototype.$http = Axios;

/* eslint no-new: 0 */
new Vue({
  el: '#app',
  render: h => h(App),
})
