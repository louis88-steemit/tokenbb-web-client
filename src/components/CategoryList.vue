<template>
  <div>
    <b-table
      v-if="subCategories.length > 0"
      :data="subCategories"
      mobile-cards
    >
      <template slot-scope="scprops">
        <b-collapse
          class="card box-style"
          aria-id="contentIdForA11y3"
        >
          <div
            slot="trigger"
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <h2 class="card-header-title">
              {{ scprops.row.name }}
            </h2>
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
      :columns="columns"
      mobile-cards
      striped
    >
      <template slot-scope="cprops">
        <router-link :to="{ path: '', query: { category : cprops.row.slug } }">
          <table class="table is-bordered is-striped is-fullwidth category-table box-style">
            <tbody class="content">
              <tr>
                <td width="70%">
                  <h4>
                    {{ cprops.row.title }}
                  </h4>
                  <span>{{ cprops.row.description }}</span>
                </td>
                <td
                  style="text-align:center;"
                  width="15%"
                >
                  {{ cprops.row.meta ? cprops.row.meta.topics : '' }} Topics
                  <br>
                  {{ cprops.row.meta ? cprops.row.meta.views : '' }} Views
                </td>
                <td
                  style="text-align:center;"
                  width="15%"
                >
                  {{ cprops.row.meta ? cprops.row.meta.last_action.author : '' }}
                </td>
              </tr>
            </tbody>
          </table>
        </router-link>
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
