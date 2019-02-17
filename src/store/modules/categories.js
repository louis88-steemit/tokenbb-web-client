import api from '../../services/api'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryList: [],
    categoriesById: {}
  },
  mutations: {
    fetching (state, value) { state.fetching = value },
    categoryList (state, value) { Vue.set(state, 'categoryList', value) },
    categoriesById (state, value) { Vue.set(state, 'categoriesById', value) },
    add (state, category) {
      state.categoryList.push(category)
      Vue.set(state.categoriesById, category._id, category)
    },
    remove (state, category) {
      let index = state.categoryList.indexOf(c => c._id === category._id)
      if (index !== -1) {
        Vue.delete(state.categoryList, index)
        Vue.delete(state.categoriesById, category._id)
      }
    },
    updateCategoryList (state, categories) {
      let categoriesById = categories.reduce((index, category) => {
        index[category._id] = category
        return index
      }, {})
      Vue.set(state, 'categoryList', categories)
      Vue.set(state, 'categoriesById', categoriesById)
    }
  },
  actions: {
    async add ({ commit }, category) {
      let { name: categoryName, title, description } = category
      commit('fetching', true)
      try {
        let _category = await api.addCategory(categoryName, title, description)
        commit('add', _category)
      } catch (err) {
        console.error(err)
      } finally {
        commit('fetching', false)
      }
    },
    async remove ({ commit }, category) {
      commit('fetching', true)
      try {
        await api.removeCategory(category.name)
        commit('remove', category)
      } catch (err) {
        console.error(err)
      } finally {
        commit('fetching', false)
      }
    },
    async fetchAll ({ commit }) {
      commit('fetching', true)
      try {
        let categories = await api.listCategories()
        commit('updateCategoryList', categories)
      } catch (err) {
        console.error(err)
      } finally {
        commit('fetching', false)
      }
    }
  }
}
