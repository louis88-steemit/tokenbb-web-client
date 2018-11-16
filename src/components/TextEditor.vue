<template>
  <VueEditor 
    v-model="content"
    @input="handleTextChange"
    :disabled="fetching"
    :editorToolbar="customToolbar">
  </VueEditor>
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
      customToolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [ 'bold', 'italic', 'underline' ],
        [ { 'list': 'ordered' }, { 'list': 'bullet' } ],
        [ 'code-block' ]
      ]
    }
  },
  methods: {
    handleTextChange (value) {
      this.$emit('input', value)
    }
  }
}
</script>