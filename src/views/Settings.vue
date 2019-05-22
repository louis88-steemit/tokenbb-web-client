<template>
  <div class="container setting-view">
    <p>Settings</p>

    <h3 class="title">
      Categories
    </h3>

    <div class="card-content content">
      <div v-if="orderEdit">
        <button
          class="button is-small"
          :class="{ 'is-loading': fetching }"
          :disabled="fetching"
          @click="saveOrdering()"
        >
          Save Ordering
        </button>
        <button
          class="button is-small"
          :class="{ 'is-loading': fetching }"
          :disabled="fetching"
          @click="cancelOrdering()"
        >
          Cancel
        </button>
      </div>
      <div v-else>
        <button
          class="button is-small"
          :class="{ 'is-loading': fetching }"
          :disabled="fetching || activeEdits"
          @click="enableOrderingEdit()"
        >
          Modify Order
        </button>
      </div>
      <Tree
        :data="[ categoryTree.tree ]"
        draggable
      >
        <template slot-scope="props">
          <div
            v-if="props.data.isGroup"
            class="is-tablet box cat-style"
          >
            <b-field
              v-if="props.data.edit"
            >
              <b-input
                v-model="props.data.edit.name"
                placeholder="Name"
                :maxlength="64"
                :has-counter="false"
              />
              <button
                v-if="props.data.edit"
                class="button is-small"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching"
                @click="saveGroup( props.data.nav )"
              >
                Save
              </button>
              <button
                class="button is-small"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching"
                @click="cancelGroupEdit( props.data.nav )"
              >
                Cancel
              </button>
            </b-field>
            <div
              v-else
            >
              <a
                class=""
                @click="props.store.toggleOpen( props.data )"
              >
                <b-icon
                  :icon="props.data.open ? 'menu-up' : 'menu-down'"
                />
              </a>
              {{ props.data.name }}
              <button
                class="button is-small"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching || activeEdits"
                @click="enableGroupEdit(props.data.nav)"
              >
                Edit
              </button>
            </div>
            <div v-if="props.data.open">
              <button
                class="button is-small"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching || activeEdits"
                @click="addCategoryToGroup(props.data.nav)"
              >
                Add Category
              </button>
              <button
                class="button is-small"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching || activeEdits"
                @click="addGroupToGroup(props.data.nav)"
              >
                Add Category Group
              </button>
            </div>
          </div>
          <div
            v-else
            class="columns is-tablet box cat-style"
          >
            <div class="column cat-stats">
              <span class="cprops-title">{{ props.data.slug }}</span>
            </div>
            <div class="column cat-stats">
              <b-field
                v-if="props.data.edit"
              >
                Name
                <b-input
                  v-model="props.data.edit.name"
                  placeholder="Name"
                  :maxlength="64"
                  :has-counter="false"
                />
              </b-field>
              <div
                v-else
              >
                {{ props.data.name }}
              </div>
            </div>
            <div class="column cat-stats">
              <b-field
                v-if="props.data.edit"
              >
                Title
                <b-input
                  v-model="props.data.edit.title"
                  placeholder="Title"
                  :maxlength="64"
                  :has-counter="false"
                />
              </b-field>
              <div
                v-else
              >
                {{ props.data.title }}
              </div>
            </div>
            <div class="column cat-stats">
              <b-field
                v-if="props.data.edit"
              >
                Description
                <b-input
                  v-model="props.data.edit.description"
                  placeholder="Description"
                  :maxlength="320"
                  :has-counter="false"
                />
              </b-field>
              <div
                v-else
              >
                {{ props.data.description }}
              </div>
            </div>
            <div class="column">
              <button
                v-if="props.data.edit"
                class="button is-small"
                style="min-width: 40px; max-width: 40px ; width: 40px"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching"
                @click="props.data.slug ? saveCategory( props.data.slug ) : addCategory( props.data.nav )"
              >
                Save
              </button>
              <button
                class="button is-small"
                style="min-width: 40px; max-width: 40px ; width: 40px"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching || ( !props.data.edit && activeEdits )"
                @click="props.data.slug ? toggleCategoryEdit( props.data.slug ) : cancelAdd( props.data.nav )"
              >
                <div v-if="props.data.edit">
                  Cancel
                </div>
                <div v-else>
                  Edit
                </div>
              </button>
            </div>
          </div>
        </template>
      </Tree>
    </div>
  </div>
</template>

<script>
import Field from 'buefy/src/components/field/Field';
import Icon from 'buefy/src/components/icon/Icon';
import Input from 'buefy/src/components/input/Input';
import { DraggableTree } from 'vue-draggable-nested-tree';
import Vue from 'vue';
import { mapState } from 'vuex';
import { stringToSlug } from '../utils/slug.js';

function getCategoryOrdering( treeGroup ) {
  const categories = [];
  const groups = [];
  for ( let i = 0; i < treeGroup.children.length; i++ ) {
    const child = treeGroup.children[i];
    if ( child.isGroup ) {
      groups.push( getCategoryOrdering( child ) );
    } else {
      categories.push( child.slug );
    }
  }
  return {
    slug: treeGroup.slug,
    name: treeGroup.name,
    categories,
    groups,
  };
}

export default {
  name: 'Settings',
  components: {
    BIcon: Icon,
    BField: Field,
    BInput: Input,
    Tree: DraggableTree,
  },
  data() {
    return {
      orderEdit: false,
      editingCategory: {},
      editingGroup: {},
    };
  },
  computed: {
    ...mapState( 'categories', [
      'categoryList',
      'fetching',
      'categoriesByBreadcrumb',
    ] ),
    categoryTree() {
      if ( !this.categoriesByBreadcrumb ) {
        return {};
      }
      const categoriesBySlug = {};
      const groupsByNav = {};
      const editingCategory = this.editingCategory;
      const editingGroup = this.editingGroup;
      const orderEdit = this.orderEdit;
      function convertTree( categoryGroup ) {
        const cats = categoryGroup.categories.map( ( cat ) => {
          return {
            slug: cat.slug,
            name: cat.name,
            title: cat.title,
            description: cat.description,
            edit: editingCategory[cat.slug],
            draggable: orderEdit,
            droppable: false,
            isGroup: false,
          };
        } );
        categoryGroup.categories.forEach( ( cat ) => {

          // copy main properties before Tree modifies
          // them for rendering
          categoriesBySlug[cat.slug] = { ...cat };
        } );
        const groups = categoryGroup.groups.map( ( g ) => {
          return convertTree( g );
        } );
        const group = {
          name: categoryGroup.name,
          slug: categoryGroup.slug,
          nav: categoryGroup.nav,
          edit: editingGroup[categoryGroup.nav],
          children: groups.concat( cats ),
          draggable: orderEdit,
          isGroup: true,
        };
        groupsByNav[categoryGroup.nav] = group;

        // Check if user added category for this group.
        if ( editingCategory[categoryGroup.nav] ) {
          group.children.unshift( {
            slug: '',
            nav: categoryGroup.nav,
            edit: editingCategory[categoryGroup.nav],
            draggable: false,
            droppable: false,
            isGroup: false,
          } );
        }
        const newGroupNav = categoryGroup.nav + '/__NEW__';
        if ( editingGroup[newGroupNav] ) {
          const newGroup = {
            slug: '',
            nav: newGroupNav,
            edit: editingGroup[newGroupNav],
            draggable: false,
            isGroup: true,
          };
          group.children.unshift( newGroup );
          groupsByNav[newGroupNav] = newGroup;
        }
        return group;
      }
      const tree = convertTree( this.categoriesByBreadcrumb );
      return {
        tree,
        categoriesBySlug,
        groupsByNav,
      };
    },
    activeEdits() {
      return Object.values( this.editingCategory ).filter( ( e ) => e ).length > 0
         || Object.values( this.editingGroup ).filter( ( e ) => e ).length > 0
         || this.orderEdit;
    },
  },
  methods: {
    enableOrderingEdit() {
      this.orderEdit = true;
      this.editingCategory = {};
    },
    async saveOrdering() {

      // get category ordering.
      const categoryOrdering = getCategoryOrdering( this.categoryTree.tree );
      try {
        await this.$store.dispatch( 'forum/editCategoryOrdering', categoryOrdering );
        await this.$store.dispatch( 'forum/fetch' );
        await this.$store.dispatch( 'categories/fetchAll' );
      } catch ( err ) {
        console.error( err );
      } finally {
        this.orderEdit = false;
      }
    },
    cancelOrdering() {
      this.orderEdit = false;
      this.$store.dispatch( 'categories/fetchAll' );
    },
    enableGroupEdit( nav ) {
      const thisGroup = this.categoryTree.groupsByNav[nav];
      Vue.set( this.editingGroup, nav, { name: thisGroup.name, slug: thisGroup.slug } );
    },
    cancelGroupEdit( nav ) {
      Vue.set( this.editingGroup, nav, null );
    },
    async saveGroup( nav ) {
      const group = this.categoryTree.groupsByNav[nav];
      group.name = this.editingGroup[nav].name;
      if ( !this.editingGroup[nav].slug ) {
        group.slug = stringToSlug( group.name );
      }
      await this.saveOrdering();
      Vue.set( this.editingGroup, nav, null );
    },
    addGroupToGroup( nav ) {

      // Used to indicate something is being edited
      const newGroup = {
        name: '',
      };
      Vue.set( this.editingGroup, nav + '/__NEW__', newGroup );
    },
    addCategoryToGroup( nav ) {

      // Used to indicate something is being edited
      const newCat = {
        name: '',
        title: '',
        description: '',
      };
      Vue.set( this.editingCategory, nav, newCat );
    },
    cancelAdd( nav ) {
      Vue.set( this.editingCategory, nav, null );
    },
    toggleCategoryEdit( slug ) {
      const thisCategory = this.categoryTree.categoriesBySlug[slug];
      if ( !this.editingCategory[slug] ) {
        Vue.set( this.editingCategory, slug, { ...thisCategory } );
      } else {
        Vue.set( this.editingCategory, slug, null );
      }
    },
    async addCategory( nav ) {
      try {
        await this.$store.dispatch( 'categories/add', {
          name: this.editingCategory[nav].name,
          title: this.editingCategory[nav].title,
          description: this.editingCategory[nav].description,
          nav,
        } );
        this.editingCategory[nav] = null;
        await this.$store.dispatch( 'forum/fetch' );
        await this.$store.dispatch( 'categories/fetchAll' );
      } catch ( err ) {
        console.error( err );
      } finally {
        this.fetching = false;
      }
    },
    saveCategory( slug ) {
      this.$store.dispatch( 'categories/edit', this.editingCategory[slug] )
        .then( () => {
          this.editingCategory[slug] = null;
          this.$nextTick( () => this.$store.dispatch( 'categories/fetchAll' ) );
        }, ( err ) => {
          console.error( err );
          this.editingCategory[slug] = null;
          this.fetching = false;
        } );
    },
    remove( category ) {
      this.$store.dispatch( 'categories/remove', category )
        .then( () => this.$nextTick( () => this.$store.dispatch( 'categories/fetchAll' ) ) )
        .catch( ( err ) => {
          console.error( err );
          this.fetching = false;
        } );
    },
  },
};
</script>
