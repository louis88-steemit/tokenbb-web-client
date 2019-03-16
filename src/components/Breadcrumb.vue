<template>
  <nav
    class="breadcrumb"
    aria-label="breadcrumbs"
  >
    <ul>
      <li>
        <router-link :to="{ path: '/' }">
          Home
        </router-link>
      </li>
      <li
        v-for="crumb in crumbs"
        :key="crumb.name"
      >
        <router-link :to="{ path: crumb.path, query: crumb.query }">
          {{ crumb.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    crumbs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
