<template>
  <div>
    <div v-if="!loggedIn && !hidden">
      <a class="button is-primary is-outlined" :href="loginURL">
        {{ text || 'Login to reply' }}
      </a>
    </div>
    <slot v-if="loggedIn"></slot>
  </div>
</template>

<script>
import steem from '@/services/steem.service'

export default {
  props: {
    text: String,
    hidden: Boolean
  },
  data () {
    return {
      loginURL: steem.connect.getLoginURL()
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.accessToken
    }
  }
}
</script>