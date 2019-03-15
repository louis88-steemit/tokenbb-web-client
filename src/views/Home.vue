<template>
  <div class="container home">
    <CategoryList
      :categories-by-breadcrumb="categoriesByBreadcrumb"
      :fetching="fetching"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex';

import CategoryList from '@/components/CategoryList.vue';

export default {
  name: 'Home',
  components: {
    CategoryList,
  },
  computed: {
    ...mapState( 'categories', [
      'categoriesByBreadcrumb',
      'fetching',
    ] ),
  },
};
</script>

