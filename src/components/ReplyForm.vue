<template>
  <form @submit.prevent="$emit('submit')" class="new-reply">
    <b-field>
      <TextEditor
        :fetching="fetching"
        @input="handleTextChange">
      </TextEditor>
    </b-field>

    <b-field>
      <div class="control">
        <button role="submit"
          class="button is-primary"
          v-bind:class="{ 'is-loading': fetching }">
          Reply
        </button>
      </div>
    </b-field>
  </form>
</template>

<script>
import TextEditor from '@/components/TextEditor.vue'

export default {
  components: {
    TextEditor
  },
  props: {
    fetching: Boolean,
    text: String
  },
  methods: {
    handleTextChange (value) {
      this.$emit('input', value)
    }
  },
  data () {
    return {
      content: '',
      customToolbar: [
        [ { 'header': [ 1, 2, 3, 4, 5, 6, false ] } ],
        [ 'bold', 'italic', 'underline' ],
        [ { 'list': 'ordered' }, { 'list': 'bullet' } ],
        [ 'code-block' ]
      ]
    }
  }
}
</script>
