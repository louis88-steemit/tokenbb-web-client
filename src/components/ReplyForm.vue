<template>
  <form @submit.prevent="$emit('submit')" class="new-reply">
    <b-field>
      <TextEditor
        ref="editor"
        :fetching="fetching"
        @input="handleTextChange">
      </TextEditor>
    </b-field>

    <b-field>
      <div class="control">
        <button role="submit"
          class="button is-primary"
          :disabled="text.length == 0"
          v-bind:class="{ 'is-loading': fetching }">
          Reply
        </button>
        &nbsp;
      </div>
    </b-field>
  </form>
</template>

<script>
import TextEditor from '@/components/TextEditor.vue';

export default {
  components: {
    TextEditor,
  },
  props: {
    fetching: Boolean,
    text: String,
    quote: String,
    quoteAuthor: String,
  },
  methods: {
    handleTextChange( value ) {
      this.$emit( 'input', value );
    },
  },
  data() {
    return {
      content: '',
      customToolbar: [
        [ { 'header': [ 1, 2, 3, 4, 5, 6, false ] } ],
        [ 'bold', 'italic', 'underline' ],
        [ { 'list': 'ordered' }, { 'list': 'bullet' } ],
        [ 'code-block' ],
      ],
    };
  },
};
</script>
