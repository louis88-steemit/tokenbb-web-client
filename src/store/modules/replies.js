import api from '../../services/post'

export default {
  namespaced: true,
  state: {
    fetching: true
  },
  mutations: {
    fetching (state, value) { state.fetching = value }
  },
  actions: {
    async submit ({ state, commit }, reply) {
      let author = state.auth.current
      let { parentComment, content } = reply
      commit('fetching', true)
      try {
        await api.createReply(parentComment, author, content)
      } catch (err) {
        console.error(err)
      } finally {
        commit('fetching', false)
      }
    }
  }
}
