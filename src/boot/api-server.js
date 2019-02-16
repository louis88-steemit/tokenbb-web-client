// import something here
import api from '../services/api'
import { Cookies } from 'quasar'

// leave the export, even if you don't use it
export default async ({ Vue, ssrContext }) => {
  const cookies = Cookies.parseSSR(ssrContext)
  api.instance.interceptors.request.use((config) => {
    var token = cookies.get('token')
    if (token) {
      config.headers.authorization = 'Bearer ' + token
    }
  })
  Vue.prototype.$api = api
}

export { api }
