import Vue from 'vue'

// that module will be dinamically registered on New Forum page
export default {
  namespaced: true,
  state: {
    selectedCategoryId: null,
    selected: null
  },
  mutations: {
    selectedCategoryId (state, value) { state.selectedCategoryId = value },
    selected (state, value) { state.selected = value }
  },
  actions: {
    async init ({ dispatch }) {
      await dispatch('categories/fetchAll')
      await dispatch('topics/fetchAll')
      await Vue.nextTick()

      let categoryParam = this.$router.currentRoute.query.category
      let counter = parseInt(this.$router.currentRoute.query.i) || 0
      if (categoryParam) {
        this.$router.push({ path: '/', query: { category: categoryParam, i: counter + 1 } })
        await Vue.nextTick()
        this.$router.push({ path: '/', query: { category: categoryParam } })
      }
    },
    async fetchCategory ({ state, rootState, commit }, categoryQuery) {
      commit('selectedCategoryId', categoryQuery || null)
      let selectedCategory = rootState.categories.categoryList.find(category => {
        return category.slug === state.selectedCategoryId || category._id === state.selectedCategoryId
      }) || {}
      commit('selectedCategoryId', selectedCategory._id)
    },
    onSelectCategoryId (ctx, selectedCategory) {
      let query = selectedCategory ? { category: selectedCategory.slug } : {}
      this.$router.push({ path: '/', query: query })
    },
    getRowClass ({ getters }, row) {
      return getters.getRowClass(row)
    },
    topicRoute ({ getters }, topic) {
      return getters.topicRoute(topic)
    }
  },
  getters: {
    topicRoute () {
      return (topic) => `/topics/${topic.author.user}/${topic.permlink}`
    },
    getRowClass () {
      return (row) => row.pinned ? 'pinned' : ''
    }
  }
}
