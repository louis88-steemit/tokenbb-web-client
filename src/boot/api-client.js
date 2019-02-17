// import something here
import api from '../services/api'
import { Cookies } from 'quasar'

// leave the export, even if you don't use it
export default async ({ Vue, store }) => {
  var token = Cookies.get('token')
  if (token) {
    await store.dispatch('auth/setUser', token)
  }
  api.instance.interceptors.request.use((config) => {
    if (store.state.auth && store.state.auth.token) {
      config.headers.authorization = 'Bearer ' + store.state.auth.token
    }
  })
  Vue.prototype.$api = api
}

export { api }
