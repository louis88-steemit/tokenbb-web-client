import api from '../../services/api'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    fetching: true,
    topicList: []
  },
  mutations: {
    fetching (state, value) { state.fetching = value },
    topicList (state, value) { Vue.set(state, 'topicList', value) },
    add (state, value) {
      state.topicList.push(value)
    },
    remove (state, category) {
      let index = state.topicList.indexOf(c => c._id === category._id)
      if (index !== -1) {
        Vue.delete(state.topicList, index)
      }
    },
    pin (state, context) {
      let { index, value } = context
      state.topicList[index].pinned = value
    }
  },
  actions: {
    withPinnedToTop ({ state }, topics) {
      return topics.sort((topicA, topicB) => {
        if (topicA.pinned === topicB.pinned) {
          return topicB.lastUpdate - topicA.lastUpdate
        } else {
          return topicA.pinned ? 1 : -1
        }
      })
    },
    async reorder ({ dispatch, commit, state }) {
      var topics = dispatch('withPinnedToTop', state.topicList)
      commit('topicList', topics)
    },
    async pin ({ commit, dispatch, state }, topic) {
      let index = state.topicList.indexOf(t => t.id === topic.id)
      commit('pin', { index, value: true })
      await dispatch('fetchAll')
    },
    async unpin ({ commit, dispatch, state }, topic) {
      let index = state.topicList.indexOf(t => t.id === topic.id)
      commit('pin', { index, value: false })
      await dispatch('fetchAll')
    },
    async create ({ state, commit }, topic) {
      let author = state.auth.current
      let { title, category, content } = topic
      commit('fetching', true)
      try {
        let _topic = await api.createTopic(author, category, title, content)
        commit('add', _topic)
      } catch (err) {
        console.error(err)
      } finally {
        commit('fetching', false)
      }
    },
    async fetchAll ({ commit, dispatch }) {
      commit('fetching', true)
      try {
        let topics = dispatch('withPinnedToTop', await api.listTopics())
        commit('topicList', topics)
      } catch (err) {
        console.error(err)
      } finally {
        commit('fetching', false)
      }
    }
  }
}
