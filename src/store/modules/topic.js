import post from '../../services/post'
import { Vue } from 'vue'

// that module will be dinamically registered on Topic page
export default {
  namespaced: true,
  state: {
    fetching: true,
    topic: {},
    replyText: ''
  },
  mutations: {
    fetching (state, value) { state.fetching = value },
    topic (state, value) { Vue.set(state, 'topic', value) },
    replyText (state, value) { state.replyText = value }
  },
  actions: {
    async init () {

    },
    async onReplySubmit ({ state, dispatch }) {
      const payload = {
        parentComment: state.topic,
        content: state.replyText
      }

      try {
        let reply = await dispatch('replies/submitReply', payload)
        if (reply) {
          await dispatch('fetchTopic')
        }
      } catch (err) {
        this.$ga.exception(err)
      }
    },
    async fetchTopic ({ commit }) {
      let { author, permlink } = this.$route.params
      commit('fetching', true)

      let topic = await post.getTopic(author, permlink)
      if (!topic) {
        return this.$router.push('/')
      }
      commit('topic', topic)
      commit('fetching', false)
    },
    onReplyInput ({ commit }, text) {
      commit('replyText', text)
    },
    categoryFromId ({ getters }, id) {
      return getters.categoryFromId(id)
    }
  },
  getters: {
    categoryFromId (state, getters, rootState) {
      return (id) => {
        let category = rootState.categories.categoriesBySlug[id] || { name: '' }
        return category.name
      }
    }
  }
}
