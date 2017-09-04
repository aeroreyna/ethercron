var $ = window.jQuery = require('jquery');
require('materialize-css/dist/css/materialize.css')
require('materialize-css/dist/js/materialize.js')
window.axios = require('axios')

window.api = require('@/components/apiHandler');
api.getAddressInfo();

import HitBTC from 'hitbtc-api';
window.HitBTC = HitBTC;

//const restClient = new HitBTC({ key, secret, isDemo: false });
//const websocketClient = new HitBTC.WebsocketClient({ key, secret, isDemo: false });

import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
