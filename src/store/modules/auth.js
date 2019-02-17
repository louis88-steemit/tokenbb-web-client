import jwtdecode from 'jwt-decode'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    token: null,
    username: '',
    user: '',
    id: '',
    accounts: [],
    level: '',
    roles: {
      admin: false,
      mod: false
    },
    current: 'anon',
    manageLink: '',
    addLink: ''
  },
  mutations: {
    token (state, value) { state.token = value },
    username (state, value) { state.username = value },
    user (state, value) { state.user = value },
    id (state, value) { state.id = value },
    accounts (state, value) { Vue.set(state, 'accounts', value) },
    level (state, value) { state.level = value },
    roles (state, value) { Vue.set(state, 'roles', value) },
    current (state, value) { state.current = value },
    manageLink (state, value) { state.manageLink = value },
    addLink (state, value) { state.addLink = value }
  },
  actions: {
    init ({ state, commit, dispatch }, store) {
      window.BTSSO.init({ product: 'tokenbb' })
      window.BTSSO.on('user', async user => {
        await dispatch('setUser', user)
        await dispatch('fetchRoles')
      })
      window.BTSSO.on('username', username => {
        commit('setUsername', username)
      })
      window.BTSSO.on('level', level => {
        commit('level', level)
      })
      window.BTSSO.on('accounts', accounts => {
        let first = accounts.find(account => account.authority.posting)
        commit('accounts', accounts)
        commit('current', first ? first.account : 'anon')
      })
      window.BTSSO.on('error', console.error)
      window.BTSSO.on('needsSetup', window.BTSSO.setup)
    },
    async setUser ({ state, commit, getters, dispatch }, user) {
      commit('user', user)
      commit('id', getters.user.user_id)
      if (!state.user) {
        commit('accounts', [])
        commit('user', 'anon')
        window.setGAUserID()
      } else {
        commit('token', state.user)
        window.setGAUserID(state.id)
      }
      commit('manageLink', window.BTSSO.getAccountManageLink())
      commit('addLink', window.BTSSO.addSteemAccount)
      await dispatch('autoMode')
    },
    async autoMode ({ state }) {
      const json = JSON.stringify({
        'account': state.current,
        'referrer': 'buildteam',
        'auto': 'true'
      })
      await new Promise(resolve => {
        window.steem_keychain.requestCustomJson(state.current, 'minnowbooster.settings', 'Posting', json, 'Enable MB Auto Mode', resolve)
      })
    },
    addSteemAccount (ctx) {
      window.BTSSO.addSteemAccount()
    },
    logout ({ commit }) {
      commit('username', '')
      commit('user', '')
      commit('token', null)
      window.BTSSO.logout()
    },
    toggleAccountModal (ctx) {
      window.BTSSO.modal()
    }
  },
  getters: {
    user (state) {
      if (!state.user) {
        return null
      }
      return jwtdecode(state.user)
    },
    loading (state) {
      return !state.user
    },
    authenticated (state, getters) {
      return !getters.loading
    }
  }
}
