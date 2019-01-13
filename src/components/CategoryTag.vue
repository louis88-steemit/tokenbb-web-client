<template>
  <router-link :to="categoryRoute(categoryId)">
    <span class="tag is-info">
      {{ category }}
    </span>
  </router-link>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    categoryId: String,
  },
  computed: {
    ...mapState( {
      category( state ) {
        const byId = state.categories.categoriesById || {};
        const category = byId[this.categoryId];
        return category ? category.name : 'oops';
      },
    } ),

  },
  methods: {
    categoryRoute( id ) {
      return {
        path: '/',
        query: {
          category: id,
        },
      };
    },
  },
};
</script>
