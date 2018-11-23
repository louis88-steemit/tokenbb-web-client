import postService from '@/services/post.service'

export default {
  namespaced: true,
  state: {
    fetching: true,
    topicList: []
  },
  mutations: {
    reorder (state) {
      state.topicList = withPinnedToTop(state.topicList)
    },
    pin (state, topic) {
      var pinned = state.topicList.find(t => t.id === topic.id)

      pinned.pinned = true

      this.commit('topics/reorder')
      this.dispatch('topics/fetchAll')
    },
    unpin (state, topic) {
      var pinned = state.topicList.find(t => t.id === topic.id)

      pinned.pinned = false

      this.commit('topics/reorder')
      this.dispatch('topics/fetchAll')
    },
    setFetching (state, fetching) {
      state.fetching = fetching
    },
    updateTopicList (state, topics) {
      state.topicList = topics
    },
    addTopic (state, topic) {
      state.topicList.push(topic)
    }
  },
  actions: {
    createTopic ({ commit }, { title, category, content }) {
      var author = this.state.auth.current

      return postService.createTopic(author, category, title, content)
        .then(topic => {
          console.log(topic)
          commit('addTopic', topic.data)

          return topic.data
        })
    },
    fetchAll ({ commit }) {
      commit('setFetching', true)

      postService.listTopics(null)
        .then(topics => {
          commit('updateTopicList', withPinnedToTop(topics))
          commit('setFetching', false)
        })
        .catch(err => {
          commit('setFetching', false)

          console.error(err)
        })
    }
  }
}

function withPinnedToTop (topics) {
  var pinned = []
  var notPinned = []

  topics.forEach((topic, i) => {
    return topic.pinned
      ? pinned.push(topic)
      : notPinned.push(topic)
  })

  notPinned.sort(function (a, b) {
    return b.lastUpdate - a.lastUpdate
  })

  return pinned.concat(notPinned)
}
