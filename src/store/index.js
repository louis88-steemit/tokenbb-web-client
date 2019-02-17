import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import categories from './modules/categories'
import replies from './modules/replies'
import topics from './modules/topics'

Vue.use(Vuex)

export default function ({ ssrContext }) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      categories,
      replies,
      topics
    }
  })
  return Store
}
