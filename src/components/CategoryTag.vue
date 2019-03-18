<template>
  <router-link :to="categoryRoute(category)">
    <b-icon
      icon="tag"
      size="is-small"
    />
    {{ category.name }}
  </router-link>
</template>

<script>
import { mapState } from 'vuex';

import Icon from 'buefy/src/components/icon/Icon';

export default {
  components: {
    BIcon: Icon,
  },
  props: {
    categoryId: String,
  },
  computed: {
    ...mapState( {
      category( state ) {
        const byId = state.categories.categoriesById || {};
        const category = byId[this.categoryId];
        return category ? category : { name: 'oops' };
      },
    } ),

  },
  methods: {
    categoryRoute( cat ) {
      return {
        path: '/topic-list',
        query: {
          category: cat.slug,
        },
      };
    },
  },
};
</script>
