<template>
  <steem-editor
    v-model="content"
    language="en"
    :toolbars="customToolbar"
  />
</template>

<script>

export default {
  props: {
    fetching: Boolean,
    initialContent: String,
  },
  data() {
    return {
      content: this.initialContent,
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
  created() {
    this.$root.$on( 'quote-click', this.addQuote );
  },
  methods: {
    addQuote( quote ) {
      this.content += `\n> @${ quote.author.user }:\n${ quote.body.replace( /^/gm, '> ' ) }\n---\n`;
    },
  },
};
</script>
