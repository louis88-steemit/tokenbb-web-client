<template>
  <div>
  <b-table
    :data="subCategories"
    mobile-cards>
    <template slot-scope="scprops">
      <div class="content-box box-styling">
        <h2><strong>{{ scprops.row.name }}</strong></h2>
        <category-group :categoriesByBreadcrumb="scprops.row.subCategory">
        </category-group>
      </div>
    </template>
  </b-table>

  <b-table
    :data="categoryList"
    mobile-cards>

    <template slot-scope="cprops">
      <div class="content-box box-styling">
        <div class="content-box-middle">
          <div class="break-words">
            <router-link :to="{ path: '', query: { category : cprops.row.slug } }">
              <h2><strong>{{ cprops.row.title }}</strong></h2>
            </router-link>
          </div>
          {{ cprops.row.description }}
          <div>
            # of topics: {{ cprops.row.meta ? cprops.row.meta.topics : '' }}
          </div>
          <div>
            # of replies: {{ cprops.row.meta ? cprops.row.meta.replies : '' }}
          </div>
          <div>
            # of views: {{ cprops.row.meta ? cprops.row.meta.views : '' }}
          </div>
        </div>
        <div class="content-box-right">
          <div>
            Last post by {{ cprops.row.meta ? cprops.row.meta.last_action.author : '' }}
          </div>
          <div>
            on {{ cprops.row.meta ? cprops.row.meta.last_action.time : '' | fromNow }}
          </div>
        </div>
      </div>
    </template>
  </b-table>
  </div>
</template>

<script>
export default {
  name: 'category-group',
  props: [
    'categoriesByBreadcrumb',
  ],
  computed: {
    categoryList() {
      return this.categoriesByBreadcrumb ? this.categoriesByBreadcrumb.__entries : [];
    },
    subCategories() {
      const subCategories = [];
      if ( this.categoriesByBreadcrumb ) {
        Object.keys( this.categoriesByBreadcrumb ).forEach( ( key ) => {
          if ( key !== '__entries' ) {
            subCategories.push( {
              name: key,
              subCategory: this.categoriesByBreadcrumb[key],
            } );
          }
        } );
      }
      return subCategories;
    },
  },
};
</script>
