import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from '@/services';
import "@/utils/mta";
import '@/assets/css/reset.scss';
import variable from '@/utils/variable'

import LoadingPlugin from 'vux/src/plugins/loading';
import ToastPlugin from 'vux/src/plugins/toast';
import AlertPlugin from 'vux/src/plugins/alert';

import routes from './routes';
import '@/utils/flexible';
import '../../assets/css/app.less';

Vue.use(VueRouter);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(AlertPlugin);
Vue.use(variable)

Vue.prototype.$http = Axios;

const router = new VueRouter({
  routes,
});


/* eslint no-new: "off" */
new Vue({
  router,
}).$mount('#app');
