<template>
  <b-collapse
    v-if="categoryGroups.length > 0 || categories.length > 0"
    class="card box-style"
    aria-id="contentIdForA11y3"
  >
    <div
      slot="trigger"
      slot-scope="cardprops"
      class="card-header"
      role="button"
      aria-controls="contentIdForA11y3"
    >
      <h2 class="card-header-title">
        <router-link :to="{ path: '/', query: { nav: nav } }">
          {{ name }}
        </router-link>
      </h2>
      <a class="card-header-icon">
        <b-icon
          :icon="cardprops.open ? 'menu-up' : 'menu-down'"
        />
      </a>
    </div>
    <div class="card-content">
      <div class="content">
        <div>
          <b-table
            v-if="categoryGroups.length > 0"
            :data="categoryGroups"
            :loading="fetching"
            mobile-cards
          >
            <template slot-scope="cgprops">
              <CategoryGroup
                :categories-by-breadcrumb="cgprops.row"
                :fetching="fetching"
              />
            </template>
          </b-table>

          <b-table
            v-if="categories.length > 0"
            :loading="fetching"
            :data="categories"
            mobile-cards
            striped
          >
            <template slot-scope="cprops">
              <router-link :to="{ path: 'topic-list', query: { category : cprops.row.slug } }">
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
      </div>
    </div>
  </b-collapse>
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
    fetching: {
      type: Boolean,
      default: true,
    },
    categoriesByBreadcrumb: {
      type: Object,
      default: null,
    },
  },
  computed: {
    nav() {
      return this.categoriesByBreadcrumb ? this.categoriesByBreadcrumb.nav : '/';
    },
    name() {
      return this.categoriesByBreadcrumb ? this.categoriesByBreadcrumb.name : 'Home';
    },
    categories() {
      return this.categoriesByBreadcrumb ? this.categoriesByBreadcrumb.categories : [];
    },
    categoryGroups() {
      return this.categoriesByBreadcrumb ? this.categoriesByBreadcrumb.groups : [];
    },
  },
};
</script>
