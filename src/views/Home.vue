<template>
  <div class="container home">
    <div class="level-left">
      <nav
        v-if="queryCategoriesByBreadcrumb.breadcrumb.length > 0"
        class="breadcrumb"
        aria-label="breadcrumbs"
      >
        <ul>
          <li>
            <router-link :to="{ path: '/' }">
              Home
            </router-link>
          </li>
          <li
            v-for="crumb in queryCategoriesByBreadcrumb.breadcrumb"
            :key="crumb.name"
          >
            <router-link :to="{ path: crumb.path, query: crumb.query }">
              {{ crumb.name }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <CategoryList
      :categories-by-breadcrumb="queryCategoriesByBreadcrumb.categoriesByBreadcrumb"
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
    queryCategoriesByBreadcrumb() {
      let categoriesByBreadcrumb = this.categoriesByBreadcrumb;
      const breadcrumb = [];
      const queryNav = this.$route.query.nav;
      if ( queryNav && this.categoriesByBreadcrumb ) {
        const queryGroup = this.categoriesByBreadcrumb.categoryGroupsByNav[queryNav];
        if ( queryGroup ) {
          categoriesByBreadcrumb = queryGroup;
          const navBreadcrumb = queryNav.split( '/' );
          let nav = '';
          for ( let idx = 0; idx < navBreadcrumb.length; idx++ ) {
            const crumb = navBreadcrumb[idx];
            nav = nav + ( nav !== '' ? '/' : '' ) + crumb;
            const group = this.categoriesByBreadcrumb.categoryGroupsByNav[nav];
            breadcrumb.push( { path: '/', query: { nav }, name: group.name } );
          }
        }
      }
      return { breadcrumb, categoriesByBreadcrumb };
    },
  },
};
</script>

