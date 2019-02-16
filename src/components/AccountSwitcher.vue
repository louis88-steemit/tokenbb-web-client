<template>
  <b-dropdown @change="onChange">
    <button class="button is-primary" type="button" slot="trigger">
      <Avatar :author="current" owner="id" size="small"></Avatar>&nbsp;
      {{ current | usernameDisplay(id) }}
    </button>

    <b-dropdown-item :value="all">
      <Avatar :author="all.account" owner="id" size="small"></Avatar>&nbsp;
      {{ all.account | usernameDisplay(id) }}
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

const ALL = { account: process.env.VUE_APP_ANON_USER, 'authority': { 'posting': true } };

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
      'id',
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
