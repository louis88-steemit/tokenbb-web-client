<template>
  <mavon-editor v-model="value" language="en" :toolbars="customToolbar" />
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  props: {
    fetching: Boolean
  },
  data () {
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
    }
  },
}
</script>