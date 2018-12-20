import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import axios from 'axios'
import router from "./router";
import utils from './assets/js/utils.js'
import global from './components/Global.vue'

import './assets/css/reset.css'
import './assets/css/global.css'

Vue.use(ElementUI)
Vue.config.productionTip = false;
axios.defaults.baseURL = global.hostUrl
Vue.prototype.$utils = utils
Vue.prototype.$ajax = axios
Vue.prototype.$global = global
// Vue.prototype.$echarts = echarts

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
