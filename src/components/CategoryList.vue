<template>
  <div>
  <b-table
    :data="subCategories"
    mobile-cards>
    <template slot-scope="scprops">
      <b-table-column field="subcat" label="Name">
        {{ scprops.row.name }}
      </b-table-column>
      <b-table-column field="subcat" label="Subcategory">
        <category-group :categoriesByBreadcrumb="scprops.row.subCategory">
        </category-group>
      </b-table-column>
    </template>
  </b-table>

  <b-table
    :data="categoryList"
    mobile-cards>

    <template slot-scope="cprops">
      <b-table-column field="title" label="Title">
        <a @click="onSelectCategoryId( cprops.row )">
          {{ cprops.row.title }}
        </a>
      </b-table-column>
      <b-table-column field="description" label="Description">
        {{ cprops.row.description }}
      </b-table-column>
      <b-table-column field="last_activity" label="Last Activity">
        {{ cprops.row.meta ? cprops.row.meta.last_action.time : '' }}
      </b-table-column>
      <b-table-column field="last_user" label="Last User">
        {{ cprops.row.meta ? cprops.row.meta.last_action.author : '' }}
      </b-table-column>
      <b-table-column field="topics" label="Topics">
        {{ cprops.row.meta ? cprops.row.meta.topics : '' }}
      </b-table-column>
      <b-table-column field="replies" label="Replies">
        {{ cprops.row.meta ? cprops.row.meta.replies : '' }}
      </b-table-column>
      <b-table-column field="views" label="Views">
        {{ cprops.row.meta ? cprops.row.meta.views : '' }}
      </b-table-column>
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
          console.log( key );
          console.log( this.categoriesByBreadcrumb[key] );
          if ( key !== '__entries' ) {
            subCategories.push( {
              name: key,
              subCategory: this.categoriesByBreadcrumb[key],
            } );
          }
        } );
      }
      console.log( subCategories );
      return subCategories;
    },
  },
};
</script>
