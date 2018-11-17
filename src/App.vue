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

      this.$store.commit('auth/init', this.$store)

      var promises = [
        this.fetchTopics(),
        this.fetchCategories()
      ]

      Promise.all(promises).then(() => {
        this.loaded = true
      })
    })
  },
  methods: {
    fetchTopics () {
      return this.$store.dispatch('topics/fetchAll')
    },
    fetchCategories () {
      return this.$store.dispatch('categories/fetchAll')
    }
  }
}
</script>
