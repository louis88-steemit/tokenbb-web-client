import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/auth.store'
import categories from '@/store/categories.store'
import topics from '@/store/topics.store'
import replies from '@/store/replies.store'
import posts from '@/store/posts.store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    categories,
    topics,
    replies,
    posts
  }
})
