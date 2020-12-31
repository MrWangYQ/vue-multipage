import Vue from 'vue'
import '@/utils/flexible'
import '@/assets/css/reset.scss'
import App from './app.vue'
import Axios from '@/services';

Vue.prototype.$http = Axios;

/* eslint no-new: 0 */
new Vue({
  el: '#app',
  render: h => h(App),
})
