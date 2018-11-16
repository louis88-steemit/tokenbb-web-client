import steem from '@/services/steem.service'
import api from '@/services/api.service'
import router from '@/router'
import { ACCESS_TOKEN_KEY, USERNAME_KEY } from '@/constants'

export default {
  namespaced: true,
  state: {
    accessToken: '',
    username: '',
    roles: []
  },
  mutations: {
    setRoles (state, roles = []) {
      state.roles = roles
    },
    logout (state) {
      window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      window.sessionStorage.removeItem(USERNAME_KEY)

      state.accessToken = ''
      state.username = ''
      state.roles = []
    },
    storeSession () {
      window.sessionStorage.setItem(ACCESS_TOKEN_KEY, router.currentRoute.query.access_token)
      window.sessionStorage.setItem(USERNAME_KEY, router.currentRoute.query.username)

      router.replace('/')
    },
    loadSession (state) {
      var accessToken = window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
      var username = window.sessionStorage.getItem(USERNAME_KEY)

      if (accessToken && username) {
        steem.connect.setAccessToken(accessToken)

        state.accessToken = accessToken
        state.username = username
      }
    }
  },
  actions: {
    async listRoles ({ commit }) {
      var roles = await api.listRoles()

      commit('setRoles', roles)
    }
  }
}
