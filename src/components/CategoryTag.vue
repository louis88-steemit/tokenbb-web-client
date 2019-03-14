<template>
  <router-link :to="categoryRoute(categoryId)">
    <b-tag-list attached>
      <b-tag type="is-secondary">
        <b-icon
          icon="tag"
          size="is-small"
        />
      </b-tag>
      <b-tag type="is-dark">
        {{ this.category }}
      </b-tag>
    </b-tag-list>
  </router-link>
</template>

<script>
import { mapState } from 'vuex';

import Icon from 'buefy/src/components/icon/Icon';
import Tag from 'buefy/src/components/tag/Tag';
import TagList from 'buefy/src/components/tag/Taglist';

export default {
  components: {
    BIcon: Icon,
    BTag: Tag,
    BTagList: TagList,
  },
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
