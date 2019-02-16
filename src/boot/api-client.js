// import something here
import api from '../services/api'

// leave the export, even if you don't use it
export default async ({ Vue, store }) => {
  api.instance.interceptors.request.use((config) => {
    if (store.state.app && store.state.app.token) {
      config.headers.authorization = 'Bearer ' + store.state.app.token
    }
  })
  Vue.prototype.$api = api
}

export { api }
