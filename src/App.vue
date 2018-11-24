<template>
  <div id="app">
    <Navbar></Navbar>
    <section class="section" v-if="loaded">
      <router-view />
    </section>
  </div>
</template>

<style lang="scss">
@import "./themes/default.scss";
@import "./themes/monsters.scss";
</style>

<script>
import Navbar from './components/Navbar.vue'

const themeMap = {
  default: 'theme-default',
  monsters: 'theme-monsters',
  localhost: 'theme-monsters',
};

export default {
  components: {
    Navbar
  },
  data () {
    return {
      loaded: false,
      theme: 'theme-default'
    }
  },
  mounted () {
    this.$nextTick(function () {

      const theme = (new URL(window.location)).hostname.split('.')[0];
      if(themeMap.hasOwnProperty(theme)){
        this.theme = themeMap[theme];
      }
      console.log(this.theme)
      document.documentElement.className = `${this.theme}`;

      this.$store.commit('auth/init', this.$store)

      this.$store.dispatch('categories/fetchAll')
        .then(() => this.$store.dispatch('topics/fetchAll'))
        .then(() => this.loaded = true)
    })
  }
}
</script>
