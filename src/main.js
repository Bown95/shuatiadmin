import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'iview/dist/styles/fonts/ionicons.svg'
import 'iview/dist/styles/fonts/ionicons.ttf'
import 'iview/dist/styles/fonts/ionicons.woff'
import 'iview/dist/styles/fonts/ionicons.woff2'
// import Vant from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'
import qs from "qs"

import { api } from "./assets/js/config";
Vue.prototype.$api = api;

// import moment from 'moment'
// import VueQuillEditor from 'vue-quill-editor'
// Vue.use(VueQuillEditor)

Vue.use(iView)
// Vue.use(Vant)

// if (!String.prototype.moment) {
//   String.prototype.moment = function(formatString) {
//     formatString = formatString || 'YYYY-MM-DD HH:mm:ss'
//     return moment(this).format(formatString)
//   }
// }
// Vue.filter('dataFormat',(time,format)=>{
//   return moment(time).format(format)
// })

Vue.prototype.axios = axios

window.axios = axios;
// axios.defaults.withCredentials = true
Vue.config.productionTip = false
axios.interceptors.request.use(function (config) {
  if(config.method=="post"){
    config.data = qs.stringify(config.data);
  }
  return config;
}/* , function (error) {
  return Promise.reject(error)
} */)

router.beforeEach((to, from, next) => {
  let ausername = localStorage.getItem('ausername')
  if(ausername||to.path=='/login'){
    next()
  }else{
    next('/login')
  }
})

var config_name = "/config.json";
// var config_name = "/config_local.json";
axios
  .get(config_name, {})
  .then(function (data) {
    Object.assign(api, data.data);
    axios.defaults.baseURL = api.baseUrl;
    window.vue = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  })
  .catch(function (data) { });
