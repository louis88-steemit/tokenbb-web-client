<template>
  <div>
    <b-table
      v-if="categoryGroups.length > 0"
      :data="categoryGroups"
      mobile-cards
    >
      <template slot-scope="cgprops">
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
              {{ cgprops.row.title }}
            </h2>
            <a class="card-header-icon">
              <b-icon
                :icon="cgprops.open ? 'menu-down' : 'menu-up'"
              />
            </a>
          </div>
          <div class="card-content">
            <div class="content">
              <CategoryGroup :categories-by-breadcrumb="cgprops.row" />
            </div>
          </div>
        </b-collapse>
      </template>
    </b-table>

    <b-table
      :data="categories"
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
    categories() {
      return this.categoriesByBreadcrumb ? this.categoriesByBreadcrumb.categories : [];
    },
    categoryGroups() {
      return this.categoriesByBreadcrumb ? this.categoriesByBreadcrumb.groups : [];
    },
  },
};
</script>
