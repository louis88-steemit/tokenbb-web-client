import jwtdecode from 'jwt-decode'

export default {
  namespaced: true,
  state: {
    username: '',
    user: '',
    accounts: [],
    level: '',
    current: 'anon'
  },
  mutations: {
    init (state, store) {
      window.BTSSO.init({
        product: 'tokenbb'
      })
      window.BTSSO.on('user', (user) => {
        store.commit('auth/setUser', user)
      })
      window.BTSSO.on('username', (username) => {
        store.commit('auth/setUsername', username)
      })
      window.BTSSO.on('level', (level) => {
        store.commit('auth/setLevel', level)
      })
      window.BTSSO.on('accounts', (accounts) => {
        store.commit('auth/setAccounts', accounts)
      })
      window.BTSSO.on('error', (e) => {
        console.error(e)
      })
      window.BTSSO.on('needsSetup', function () {
        window.BTSSO.setup()
      })
    },
    addSteemAccount () {
      window.BTSSO.addSteemAccount()
    },
    logout (state) {
      state.username = ''
      window.BTSSO.logout()
    },
    toggleAccountModal () {
      window.BTSSO.modal()
    },
    getAccountManageLink () {
      return window.BTSSO.getAccountManageLink()
    },
    setUser (state, user) {
      state.user = user
      if (!user) {
        state.accounts = []
        state.current = 'anon'
      }
    },
    setUsername (state, username) {
      state.username = username
    },
    setLevel (state, level) {
      state.level = level
    },
    setAccounts (state, accounts) {
      state.accounts = accounts.map(account => account.account)
      const current = state.accounts[0] || 'anon'
      console.log(`Using first account ${current}`)
      state.current = current
    },
  },
  computed: {
    decoded () {
      try {
        return jwtdecode(this.user)
      } catch (e) {
        return null
      }
    },
    loading () {
      return this.user === false
    },
    authenticated () {
      return !!this.user
    },
  },
  actions: {
  },
  notifications: {
    showLoginError: { // You can have any name you want instead of 'showLoginError'
      title: 'Login Failed',
      message: 'Failed to authenticate',
      type: 'error' // You also can use 'VueNotifications.types.error' instead of 'error'
    }
  }
}
