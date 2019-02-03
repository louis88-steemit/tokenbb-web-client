<template>
  <b-dropdown @change="onChange">
    <button class="button is-primary" type="button" slot="trigger">
      <Avatar :author="current" size="small"></Avatar>&nbsp;
      {{ current }}
    </button>

    <b-dropdown-item :value="all">
      <Avatar :author="all.account" size="small"></Avatar>&nbsp;
      {{ all.account }}
    </b-dropdown-item>

    <b-dropdown-item v-for="(account, index) in accounts" :value="account" :key="index">
      <Avatar :author="account.account" size="small"></Avatar>&nbsp;
      <b-icon icon="check-circle" type="is-success" v-if="account.authority.posting"></b-icon>
      <b-icon icon="alert-circle" type="is-danger" v-else></b-icon>
      {{ account.account }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';

import Avatar from '@/components/Avatar.vue';

const ALL = { account: 'anon', 'authority': { 'posting': true } };

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      selected: ALL,
      all: ALL,
    };
  },
  computed: {
    ...mapState( 'auth', [
      'accounts',
      'current',
    ] ),
  },
  methods: {
    onChange( value ) {
      console.log( value );
      if ( value.authority.posting ) {
        this.selected = value;
        this.$store.commit( 'auth/setCurrent', value.account );
      } else {
        window.BTSSO.authorizePosting( value.account );
        this.$store.commit( 'auth/setCurrent', this.selected.account );
        this.selected = this.selected;
      }
    },
  },
};
</script>
