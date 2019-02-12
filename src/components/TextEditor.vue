<template>
  <steem-editor v-model="content" language="en" :toolbars="customToolbar" />
</template>

<script>
export default {
  props: {
    fetching: Boolean,
  },
  data() {
    return {
      content: '',
      customToolbar: {
        header: true,
        bold: true,
        italic: true,
        underline: true,
        li: true,
        ol: true,
        fullscreen: true,
        subfield: true,
        preview: true,
      },
    };
  },
  watch: {
    content() {
      this.$emit( 'input', this.content );
    },
  },
};
</script>
