<template>
  <div>
    <div v-if="!loggedIn && !hidden">
      <a class="button is-primary is-outlined" @click="login">
        {{ text || 'Login to reply' }}
      </a>
    </div>
    <slot v-if="loggedIn"></slot>
  </div>
</template>

<script>

export default {
  props: {
    text: String,
    hidden: Boolean
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.username
    }
  },
  methods: {
    login () {
      this.$store.commit('auth/toggleAccountModal')
    }
  }
}
</script>
