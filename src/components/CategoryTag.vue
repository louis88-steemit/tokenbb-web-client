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
    categoryId: Number
  },
  computed: {
    ...mapState({
      categoriesById: state => state.categories.categoriesById
    }),
    category () {
      var byId = this.categoriesById || {}
      var category = byId[this.categoryId]
      var name = category ? category.name : 'oops'

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