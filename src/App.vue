<template>
  <div id="app">
    <Navbar></Navbar>
    <section class="section" v-if="loaded">
      <router-view />
    </section>
  </div>
</template>

<style lang="scss">
// @import "./theme.scss";
@import "./monsters.theme.scss";
</style>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    this.$nextTick(function () {
      if (this.$route.query.access_token) this.storeSession()

      var promises = [
        this.loadSession(),
        this.fetchTopics(),
        this.fetchCategories()
      ]

      Promise.all(promises).then(() => {
        this.loaded = true
      })
    })
  },
  methods: {
    storeSession () {
      this.$store.commit('auth/storeSession')
    },
    loadSession () {
      this.$store.commit('auth/loadSession')
      if (this.$store.state.auth.accessToken) {
        return this.$store.dispatch('auth/listRoles')
      }
    },
    fetchTopics () {
      return this.$store.dispatch('topics/fetchAll')
    },
    fetchCategories () {
      return this.$store.dispatch('categories/fetchAll')
    }
  }
}
</script>
