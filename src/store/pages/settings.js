// that module will be dinamically registered on Settings page
export default {
  namespaced: true,
  state: {
    name: '',
    title: '',
    description: ''
  },
  mutations: {
    name (state, value) { state.name = value },
    title (state, value) { state.title = value },
    codescriptionntent (state, value) { state.description = value }
  },
  actions: {
    async init () {

    },
    async add ({ state, dispatch, commit }) {
      try {
        await dispatch('categories/add', state)
        commit('name', '')
        commit('title', '')
        commit('description', '')
      } catch (err) {
        commit('categories/fetching', false, { root: true })
      }
    },
    async remove ({ dispatch, commit }, category) {
      try {
        await dispatch('categories/remove', category)
      } catch (err) {
        commit('categories/fetching', false, { root: true })
      }
    }
  }
}
