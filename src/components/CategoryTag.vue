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
    categorySlug: String
  },
  computed: {
    ...mapState({
      categoriesBySlug: state => state.categories.categoriesBySlug
    }),
    category () {
      const bySlug = this.categoriesBySlug || {}
      const category = bySlug[this.categorySlug]
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
