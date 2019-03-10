<template>
  <b-dropdown @change="onChange">
    <button class="button" type="button" slot="trigger">
      <span v-html="selected ? selected.name : allCategories.name"></span>
      <b-icon icon="menu-down"></b-icon>
    </button>

    <b-dropdown-item :value="allCategories">
      <span v-html="allCategories.name"></span>
    </b-dropdown-item>

    <b-dropdown-item v-for="category in categoryList" :value="category" :key="category._id">
      <span v-html="category.name"></span>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';

const ALL = { name: 'All Categories' };

export default {
  props: [
    'selectedId',
    'labelForAll',
  ],
  data() {
    return {
      selected: ALL,
      all: ALL,
    };
  },
  watch: {
    selectedId( value ) {
      this.selected = this.categoriesById[value];
    },
  },
  computed: {
    allCategories() {
      return this.labelForAll
        ? Object.assign( this.all, { name: this.labelForAll } )
        : this.all;
    },
    ...mapState( 'categories', [
      'fetching',
      'categoryList',
      'categoriesById',
    ] ),
  },
  methods: {
    onChange( value ) {
      this.$emit( 'change', value || null );
    },
  },
};
</script>
