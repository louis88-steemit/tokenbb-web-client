import Vue from 'vue'
import Buefy from 'buefy'
import moment from 'moment'

import App from './App.vue'
import router from './router'
import store from './store/index.js'

import sanitize from './plugins/sanitize.js'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(sanitize)

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MMM Do YYYY')
  }
})

global.router = router

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
