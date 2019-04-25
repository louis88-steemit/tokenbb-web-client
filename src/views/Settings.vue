<template>
  <div class="container setting-view">
    <p>Settings</p>

    <h3 class="title">
      Categories
    </h3>

    <b-table
      class="setting-page"
      :data="categoryRows"
      mobile-cards
    >
      <template slot-scope="props">
        <b-table-column
          field="slug"
          label="Slug"
        >
          {{ props.row.slug }}
        </b-table-column>

        <b-table-column
          field="name"
          label="Name"
        >
          <b-field
            v-if="props.row.edit"
          >
            <b-input
              v-model="props.row.edit.name"
              :maxlength="32"
              :has-counter="false"
            />
          </b-field>
          <div
            v-else
          >
            {{ props.row.name }}
          </div>
        </b-table-column>
        <b-table-column
          field="title"
          label="Title"
        >
          <b-field
            v-if="props.row.edit"
          >
            <b-input
              v-model="props.row.edit.title"
              :maxlength="32"
              :has-counter="false"
            />
          </b-field>
          <div
            v-else
          >
            {{ props.row.title }}
          </div>
        </b-table-column>
        <b-table-column
          field="description"
          label="Description"
        >
          <b-field
            v-if="props.row.edit"
          >
            <b-input
              v-model="props.row.edit.description"
              :maxlength="320"
              :has-counter="false"
            />
          </b-field>
          <div
            v-else
          >
            {{ props.row.description }}
          </div>
        </b-table-column>
        <b-table-column
          label="Action"
          width="150"
        >
          <button
            v-if="props.row.edit"
            class="button is-small"
            style="min-width: 40px; max-width: 40px ; width: 40px"
            :class="{ 'is-loading': fetching }"
            :disabled="fetching"
            @click="save(props.row.slug)"
          >
            Save
          </button>
          <button
            class="button is-small"
            style="min-width: 40px; max-width: 40px ; width: 40px"
            :class="{ 'is-loading': fetching }"
            :disabled="fetching"
            @click="toggleEdit(props.row.slug)"
          >
            <div v-if="props.row.edit">
              Cancel
            </div>
            <div v-else>
              Edit
            </div>
          </button>
        </b-table-column>
        <!--
        <b-table-column label="Delete" centered>

          <a class="button is-small"
            :class="{ 'is-loading': fetching }"
            @click="remove(props.row.id)">
            <b-icon
              icon="close-circle"
              size="is-small">
            </b-icon>
          </a>
        </b-table-column>
        -->
      </template>
    </b-table>

    <hr>

    <h3 class="title">
      Add a category
    </h3>

    <form @submit.prevent="add">
      <b-field label="Category Name">
        <b-input
          v-model="name"
          :maxlength="32"
          :has-counter="false"
          :disabled="fetching"
        />
      </b-field>

      <b-field label="Category Title">
        <b-input
          v-model="title"
          :maxlength="32"
          :has-counter="false"
          :disabled="fetching"
        />
      </b-field>

      <b-field label="Category Description">
        <b-input
          v-model="description"
          :maxlength="320"
          :has-counter="false"
          :disabled="fetching"
        />
      </b-field>

      <button
        role="submit"
        class="button is-small"
        :class="{ 'is-loading': fetching }"
        :disabled="fetching"
      >
        Add Category
      </button>
    </form>
  </div>
</template>

<script>
import Field from 'buefy/src/components/field/Field';
import Input from 'buefy/src/components/input/Input';

import Table from 'buefy/src/components/table/Table';
import TableColumn from 'buefy/src/components/table/TableColumn';
import Vue from 'vue';
import { mapState } from 'vuex';

export default {
  name: 'Settings',
  components: {
    BTable: Table,
    BTableColumn: TableColumn,
    BField: Field,
    BInput: Input,
  },
  data() {
    return {
      name: '',
      title: '',
      description: '',
      editing: {},
    };
  },
  computed: {
    ...mapState( 'categories', [
      'categoryList',
      'fetching',
    ] ),
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
  },
  methods: {
    toggleEdit( slug ) {
      const thisCategory = this.categoryList.find( ( c ) => c.slug === slug );
      if ( !this.editing[slug] ) {
        Vue.set( this.editing, slug, { ...thisCategory } );
      } else {
        Vue.set( this.editing, slug, null );
      }
    },
    add() {
      this.$store.dispatch( 'categories/add', {
        name: this.name,
        title: this.title,
        description: this.description,
      } )
        .then( () => {
          this.name = '';
          this.title = '';
          this.description = '';
          this.$nextTick( () => this.$store.dispatch( 'categories/fetchAll' ) );
        } )
        .catch( ( err ) => {
          console.error( err );
          this.fetching = false;
        } );
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
