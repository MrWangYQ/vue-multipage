import Vue from 'vue';
import VueJsonp from 'vue-jsonp';
import VueRouter from 'vue-router';
import '@/utils/flexible';
import '@/assets/css/reset.scss';
import Axios from '@/services';

import routes from './routes';
// import store from './store';
// console.log(VueJsonp, 'vue')
Vue.use(VueJsonp);
Vue.use(VueRouter);

Vue.prototype.$http = Axios;

const router = new VueRouter({
  routes,
});


/* eslint no-new: "off" */
new Vue({
  router,
  // store,
}).$mount('#app');
