import Vue from 'vue';
import VueRouter from 'vue-router';
import '@/utils/flexible';
import '@/assets/css/reset.scss';

import routes from './routes';
// import store from './store';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});


/* eslint no-new: "off" */
new Vue({
  router,
  // store,
}).$mount('#app');
