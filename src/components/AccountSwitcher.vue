<template>
  <b-dropdown @change="onChange">
    <button class="button" type="button" slot="trigger">
      <Avatar :author="current" size="small"></Avatar>&nbsp;
      {{ current }}
      <b-icon icon="menu-down"></b-icon>
    </button>

    <b-dropdown-item :value="all">
      <Avatar :author="all" size="small"></Avatar>&nbsp;
      {{ all }}
    </b-dropdown-item>

    <b-dropdown-item v-for="account in accounts" :value="account">
      <Avatar :author="account" size="small"></Avatar>&nbsp;
      {{ account }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex'

import Avatar from '@/components/Avatar.vue'

const ALL = 'anon';

export default {
  components: {
    Avatar,
  },
  data () {
    return {
      selected: ALL,
      all: ALL
    }
  },
  computed: {
    ...mapState('auth', [
      'accounts',
      'current'
    ])
  },
  methods: {
    onChange (value) {
      this.selected = value;
      this.$store.commit('auth/setCurrent', value)
    }
  }
}
</script>
