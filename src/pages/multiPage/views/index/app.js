import Vue from 'vue';
import VueRouter from 'vue-router';
import '@/utils/flexible';
import '@/assets/css/reset.scss';
import Axios from '@/services';
import routes from './routes';
// import store from './store';

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
