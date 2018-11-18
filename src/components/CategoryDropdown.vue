<template>
  <b-dropdown @change="onChange">
    <button class="button" type="button" slot="trigger">
      <span>{{ selected ? selected.name : allCategories.name }}</span>
      <b-icon icon="menu-down"></b-icon>
    </button>

    <b-dropdown-item :value="allCategories">
      {{ allCategories.name }}
    </b-dropdown-item>

    <b-dropdown-item v-for="category in categoryList" :value="category">
      {{ category.name }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex'

const ALL = { name: 'All Categories' }

export default {
  props: [
    'selectedSlug',
    'labelForAll'
  ],
  data () {
    return {
      selected: ALL,
      all: ALL
    }
  },
  watch: {
    selectedSlug ( value) {
      this.selected = this.categoriesBySlug[value]
    }
  },
  computed: {
    allCategories () {
      return this.labelForAll
        ? Object.assign(this.all, { name: this.labelForAll })
        : this.all
    },
    ...mapState('categories', [
      'fetching',
      'categoryList',
      'categoriesBySlug'
    ])
  },
  methods: {
    onChange (value) {
      this.$emit('change', value.slug || null)
    }
  }
}
</script>
