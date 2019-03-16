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
            :key="crumb.title"
          >
            <router-link :to="{ path: crumb.path, query: crumb.query }">
              {{ crumb.title }}
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
      let nav = [];
      if ( this.$route.query.nav ) {
        const navBreadcrumb = this.$route.query.nav.split( ',' );
        for ( let idx = 0; idx < navBreadcrumb.length; idx++ ) {
          const crumb = navBreadcrumb[idx];
          const group = categoriesByBreadcrumb.groups.find( ( g ) => g.title === crumb );
          if ( group ) {
            nav = nav.concat( crumb );
            breadcrumb.push( { path: '/', query: { nav: nav.join( ',' ) }, title: crumb } );
            categoriesByBreadcrumb = group;
          } else {
            break;
          }
        }
      }
      return { breadcrumb, categoriesByBreadcrumb };
    },
  },
};
</script>

