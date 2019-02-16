import { Notify } from 'quasar'
import { Vue } from 'vue'

export default {
  namespaced: true,
  state: {
    fetching: false,
    selectedCategory: null,
    title: '',
    content: ''
  },
  mutations: {
    fetching (state, value) { state.fetching = value },
    selectedCategory (state, value) { Vue.set(state, 'selectedCategory', value) },
    title (state, value) { state.title = value },
    content (state, value) { state.content = value }
  },
  actions: {
    async onSubmit ({ state, dispatch, commit }) {
      if (!state.selectedCategory) {
        Notify.create({
          color: 'negative',
          message: 'Please select a category'
        })
      } else {
        const payload = {
          title: state.title,
          category: state.selectedCategory.slug,
          content: state.content
        }

        commit('fetching', true)
        try {
          await dispatch('topics/createTopic', payload)
          Notify.create({
            color: 'positive',
            message: 'Your topic has been posted.'
          })
          this.$router.push('/')
        } catch (err) {
          Notify.create({
            color: 'negative',
            message: 'Oops! Could not create your topic at this moment. ' + err.error.message
          })
        } finally {
          commit('fetching', false)
        }
      }
    },
    onSelectCategory ({ commit }, selectedId) {
      commit('selectedCategory', selectedId)
    },
    handleTextChange ({ commit }, text) {
      commit('content', text)
    }
  }
}
