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
            {{ props.data.name }}
            <a
              class=""
              @click="props.store.toggleOpen( props.data )"
            >
              <b-icon
                :icon="props.data.open ? 'menu-up' : 'menu-down'"
              />
            </a>
            <div v-if="props.data.open">
              <button
                class="button is-small"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching"
                @click="addCategoryToGroup(props.data.nav)"
              >
                Add Category
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
                <b-input
                  v-model="props.data.edit.name"
                  :maxlength="32"
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
                <b-input
                  v-model="props.data.edit.title"
                  :maxlength="32"
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
                <b-input
                  v-model="props.data.edit.description"
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
                @click="props.data.slug ? save( props.data.slug ) : add( props.data.nav )"
              >
                Save
              </button>
              <button
                class="button is-small"
                style="min-width: 40px; max-width: 40px ; width: 40px"
                :class="{ 'is-loading': fetching }"
                :disabled="fetching || ( !props.data.edit && activeEdits )"
                @click="props.data.slug ? toggleEdit( props.data.slug ) : cancelAdd( props.data.nav )"
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
      editing: {},
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
      const editing = this.editing;
      const orderEdit = this.orderEdit;
      function convertTree( categoryGroup ) {
        const cats = categoryGroup.categories.map( ( cat ) => {
          return {
            slug: cat.slug,
            name: cat.name,
            title: cat.title,
            description: cat.description,
            edit: editing[cat.slug],
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
          children: groups.concat( cats ),
          draggable: orderEdit,
          isGroup: true,
        };

        // Check if user added category for this group.
        if ( editing[categoryGroup.nav] ) {
          group.children.unshift( {
            slug: '',
            nav: categoryGroup.nav,
            edit: editing[categoryGroup.nav],
            draggable: false,
            droppable: false,
            isGroup: false,
          } );
        }
        return group;
      }
      const tree = convertTree( this.categoriesByBreadcrumb );
      return {
        tree,
        categoriesBySlug,
      };
    },
    categoryRows() {
      return this.categoryList.map( ( c ) => {
        if ( this.editing[c.slug] ) {
          return {
            ...c,
            edit: this.editing[c.slug],
          };
        }
        return c;

      } );
    },
    activeEdits() {
      return Object.values( this.editing ).filter( ( e ) => e ).length > 0;
    },
  },
  methods: {
    enableOrderingEdit() {
      this.orderEdit = true;
      this.editing = {};
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
    addCategoryToGroup( nav ) {

      // Used to indicate something is being edited
      const newCat = {
        name: 'Name',
        title: 'Title',
        description: 'Description',
      };
      Vue.set( this.editing, nav, newCat );
    },
    cancelAdd( nav ) {
      Vue.set( this.editing, nav, null );
    },
    toggleEdit( slug ) {
      const thisCategory = this.categoryTree.categoriesBySlug[slug];
      if ( !this.editing[slug] ) {
        Vue.set( this.editing, slug, { ...thisCategory } );
      } else {
        Vue.set( this.editing, slug, null );
      }
    },
    async add( nav ) {
      try {
        await this.$store.dispatch( 'categories/add', {
          name: this.editing[nav].name,
          title: this.editing[nav].title,
          description: this.editing[nav].description,
          nav,
        } );
        this.editing[nav] = null;
        await this.$store.dispatch( 'forum/fetch' );
        await this.$store.dispatch( 'categories/fetchAll' );
      } catch ( err ) {
        console.error( err );
      } finally {
        this.fetching = false;
      }
    },
    save( slug ) {
      this.$store.dispatch( 'categories/edit', this.editing[slug] )
        .then( () => {
          this.editing[slug] = null;
          this.$nextTick( () => this.$store.dispatch( 'categories/fetchAll' ) );
        }, ( err ) => {
          console.error( err );
          this.editing[slug] = null;
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
