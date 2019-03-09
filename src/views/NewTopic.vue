<template>
  <div class="container fill">
    <div class="newtopic-control">
    <form @submit.prevent="onSubmit" class="new-topic">
      <div class="columns is-1-mobile is-1-tablet">
        <div class="column is-9-desktop">
            <b-field class="input-title" label="Title">
              <b-input  grouped v-model="title" placeholder="Type title here" expanded>
              </b-input>
            </b-field>
            </div>
        <div class="column">
            <b-field label="Category">
              <CategoryDropdown
                @change="onSelectCategory"
                :selectedId="selectedCategory ? selectedCategory._id : null"
                :labelForAll="'-- Select a Category --'">
              </CategoryDropdown>
            </b-field>
            </div>
            </div>
            <div class="columns">
              <div class="column">
      <b-field label="Message">
        <div class="texteditor-control">
        <TextEditor
          :fetching="fetching"
          @input="handleTextChange">
        </TextEditor>
        </div>
      </b-field>
      </div>
      </div>
      <div class="field level">
        <div class="control">
          <button role="submit"
            :class="{ 'is-loading': fetching }"
            class="button">
            Post Topic
          </button>
          &nbsp;
          <button role="cancel"
            :class="{ 'is-loading': fetching }"
            @click="onCancel"
            class="button">
            Cancel
          </button>
        </div>
      </div>
    </form>
    </div>
  </div>
</template>

<script>
import TextEditor from '@/components/TextEditor.vue';
import CategoryDropdown from '@/components/CategoryDropdown.vue';
import { mapState } from 'vuex';

export default {
  name: 'new-topic',
  components: {
    TextEditor,
    CategoryDropdown,
  },
  data() {
    return {
      fetching: false,
      selectedCategory: null,
      title: '',
      content: '',
    };
  },
  computed: {
    ...mapState( 'categories', [
      'categoriesById',
    ] ),
  },
  methods: {
    onSubmit() {
      if ( !this.selectedCategory ) {
        return this.$toast.open( {
          type: 'is-danger',
          message: 'Please select a category',
        } );
      }

      const payload = {
        title: this.title,
        category: this.selectedCategory.slug,
        content: this.content,
      };

      this.fetching = true;

      this.$store.dispatch( 'topics/createTopic', payload )
        .then( () => {
          this.$router.push( '/' );
          this.$toast.open( {
            message: 'Your topic has been posted.',
            type: 'is-primary',
          } );
        } )
        .catch( ( err ) => {
          console.error( err );
          this.$toast.open( {
            message: 'Oops! Could not create your topic at this moment. ' + err.error.message,
            type: 'is-danger',
          } );
          this.fetching = false;
        } );
    },
    onSelectCategory( selectedId ) {
      this.selectedCategory = selectedId;
    },
    handleTextChange( text ) {
      this.content = text;
    },
    onCancel( event ) {
      event.preventDefault();
      this.$router.go( -1 );
    },
  },
};
</script>
