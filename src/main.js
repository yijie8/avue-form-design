import Vue from 'vue'
import App from './App'

import AvueFormDesign from '../packages/';
import AvueUeditor from 'avue-plugin-ueditor'
import AvueMap from 'avue-plugin-map'

Vue.use(window.AVUE)
Vue.use(AvueFormDesign)
Vue.use(AvueUeditor)
Vue.use(AvueMap)


import router from '@/router'
import store from './store/index'
import './plugins/element.js'
import $ajax from "./commons/$ajax.js";
import axios from "axios";
import miment from "miment";
Vue.use(miment)

// Vue.use(loading);
Vue.prototype.$ajax = $ajax;
Vue.prototype.axios = axios;
Vue.prototype.apiurl = "https://one.tripg.com/fx/index.php/admino/";
Vue.prototype.loading = false;
Vue.config.productionTip = false;
Vue.prototype.api = function(uri,args){
  return new Promise((resolve,reject)=>{
    this.axios.post(Vue.prototype.apiurl+uri,args).then((result) => {
      if(result.data.Code!=200) {
        Vue.prototype.$message.error(result.data.Message);
        throw new Error(result.data.Message);
      }
      resolve(result.data);
    }).catch((err) => {
      reject(err)
    });
  })
}

window.vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')