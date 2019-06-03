<template>
  <steem-editor
    ref="md"
    v-model="content"
    language="en"
    :toolbars="customToolbar"
    @imgAdd="uploadEditorImage"
  />
</template>

<script>

import { uploadImage } from '../services/api.service.js';
import { quoteText } from '../utils/content';

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
      this.content += quoteText( quote );
    },
    uploadEditorImage( pos, file ) {
      const newPos = `Uploading File ${pos}, please wait...`;
      this.$refs.md.$img2Url( pos, newPos );
      uploadImage( file ).then( ( url ) => {
        const newUrl = url.success ? url.data.url : url.message;
        const reg_str = '/(!\\[\[^\\[\]*?\\]\(?=\\(\)\)\\(\\s*\(' + newPos + '\)\\s*\\)/g';
        // eslint-disable-next-line no-eval
        const reg = eval( reg_str );
        this.$refs.md.d_value = this.$refs.md.d_value.replace( reg, '$1(' + newUrl + ')' );
        this.$refs.md.$refs.toolbar_left.$changeUrl( pos, newUrl );
        this.$refs.md.iRender();
      } );
    },
  },
};
</script>
