<template>
  <b-tooltip
    :label="'@' + author"
    size="is-small"
    type="is-black">
    <figure class="image avatar" :class="classes">
      <img
        class="is-rounded"
        :title="author"
        :src="avatarURL(author)">
    </figure>
  </b-tooltip>
</template>

<script>
const SIZES = {
  small: 'is-16x16',
  medium: 'is-32x32',
  large: 'is-48x48',
};

export default {
  props: {
    author: String,
    size: String,
  },
  computed: {
    classes() {
      return SIZES[this.size];
    },
  },
  methods: {
    avatarURL( author ) {
      return 'https://img.busy.org/@' + author;
    },
  },
};
</script>
