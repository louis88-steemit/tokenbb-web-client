import Vue from 'vue'
import Buefy from 'buefy'
import moment from 'moment'

import App from './App.vue'
import router from './router'
import store from './store/index.js'

import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'

import sanitize from './plugins/sanitize.js'
import { registerSW } from './registerServiceWorker'

registerSW()

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(sanitize)

const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn'
}
miniToastr.init({types: toastTypes})

function toast ({title, message, type, timeout, cb}) {
  return miniToastr[type](message, title, timeout, cb)
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment.utc(String(value)).format('MMM Do YYYY')
  }
})

Vue.filter('fromNow', function (value) {
  if (value) {
    return moment.utc(String(value)).fromNow()
  }
})

global.router = router

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
