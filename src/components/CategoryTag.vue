<template>
  <router-link :to="categoryRoute(categoryId)">
    <span class="tag is-info">
      {{ category }}
    </span>
  </router-link>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    categoryId: String
  },
  computed: {
    ...mapState({
      categoriesById: state => state.categories.categoriesById
    }),
    category () {
      const byId = this.categoriesById || {}
      const category = byId[this.categoryId]
      const name = category ? category.name : 'oops'

      return name
    }
  },
  methods: {
    categoryRoute (id) {
      return {
        path: '/',
        query: {
          category: id
        }
      }
    }
  }
}
</script>
