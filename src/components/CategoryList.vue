<template>
  <div>
    <b-table
      v-if="subCategories.length > 0"
      :data="subCategories"
      mobile-cards
    >
      <template slot-scope="scprops">
        <b-collapse
          class="card"
          aria-id="contentIdForA11y3"
        >
          <div
            slot="trigger"
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">
              {{ scprops.row.name }}
            </p>
            <a class="card-header-icon">
              <b-icon
                :icon="scprops.open ? 'menu-down' : 'menu-up'"
              />
            </a>
          </div>
          <div class="card-content">
            <div class="content">
              <CategoryGroup :categories-by-breadcrumb="scprops.row.subCategory" />
            </div>
          </div>
        </b-collapse>
      </template>
    </b-table>

    <b-table
      :data="categoryList"
      mobile-cards
    >
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
import Icon from 'buefy/src/components/icon/Icon';
import Collapse from 'buefy/src/components/collapse/Collapse';
import Table from 'buefy/src/components/table/Table';

export default {
  name: 'CategoryGroup',
  components: {
    BTable: Table,
    BIcon: Icon,
    BCollapse: Collapse,
  },
  props: {
    categoriesByBreadcrumb: {
      type: Object,
      default: null,
    },
  },
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
