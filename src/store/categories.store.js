import apiService from '@/services/api.service'

export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryList: [],
    categoriesBySlug: {}
  },
  mutations: {
    setFetching (state, fetching) {
      state.fetching = fetching
    },
    add (state, category) {
      state.categoryList.push(category)
    },
    remove (state, category) {
      var index = state.categoryList.findIndex(c => c.slug === category.slug)
      delete state.categoriesBySlug[category.slug]
      state.categoryList.splice(index, 1)
    },
    updateCategoryList (state, categories) {
      state.categoryList = categories
      categories.forEach(category => {
        state.categoriesBySlug[category.slug] = category
      })
    }
  },
  actions: {
    add ({ commit }, name) {
      commit('setFetching', true)

      apiService.addCategory(name)
        .then(category => {
          commit('add', category)
          commit('setFetching', false)
        })
        .catch(err => {
          commit('setFetching', false)

          console.error(err)
        })
    },
    remove ({ commit }, category) {
      commit('setFetching', true)

      apiService.removeCategory(category.name)
        .then(categories => {
          commit('remove', category)
          commit('setFetching', false)
        })
        .catch(err => {
          commit('setFetching', false)

          console.error(err)
        })
    },
    fetchAll ({ commit }) {
      commit('setFetching', true)

      apiService.listCategories()
        .then(categories => {
          commit('updateCategoryList', categories.data)
          commit('setFetching', false)
        })
        .catch(err => {
          commit('setFetching', false)

          console.error(err)
        })
    }
  }
}
