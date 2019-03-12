<template>
  <div class="container fill">
    <div class="newtopic-control">
      <form
        class="new-topic"
        @submit.prevent="onSubmit"
      >
        <div class="columns is-1-mobile is-1-tablet">
          <div class="column is-9-desktop">
            <b-field
              class="input-title"
              label="Title"
            >
              <b-input
                v-model="title"
                grouped
                placeholder="Type title here"
                expanded
              />
            </b-field>
          </div>
          <div class="column dropdown-style">
            <b-field label="Category">
              <CategoryDropdown
                :selected-id="selectedCategory ? selectedCategory._id : null"
                :label-for-all="'-- Select a Category --'"
                @change="onSelectCategory"
              />
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Message">
              <div class="texteditor-control">
                <TextEditor
                  :fetching="fetching"
                  :initial-content="content"
                  @input="handleTextChange"
                />
              </div>
            </b-field>
          </div>
        </div>
        <div class="field level">
          <div class="control">
            <button
              role="submit"
              :class="{ 'is-loading': fetching }"
            >
              Post Topic
            </button>
          &nbsp;
            <button
              role="cancel"
              :class="{ 'is-loading': fetching }"
              @click="onCancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex';

import Field from 'buefy/src/components/field/Field';
import Input from 'buefy/src/components/input/Input';

import TextEditor from '../components/TextEditor.vue';
import CategoryDropdown from '../components/CategoryDropdown.vue';

import { Toast } from 'buefy/dist/components/toast';

export default {
  name: 'NewTopic',
  components: {
    BField: Field,
    BInput: Input,
    TextEditor,
    CategoryDropdown,
  },
  data() {
    return {
      fetching: false,
      selectedCategory: null,
      title: this.$route.query.title ? this.$route.query.title : '',
      content: this.$route.query.content ? this.$route.query.content : '',
    };
  },
  computed: {
    ...mapState( 'categories', [
      'categoryList',
    ] ),
  },
  watch: {
    categoryList( value ) {
      this.setSelectedCategory( value );
    },
  },
  mounted() {
    if ( this.categoryList ) {
      this.setSelectedCategory( this.categoryList );
    }
  },
  methods: {
    setSelectedCategory( categoryList ) {
      const queryCategory = this.$route.query.category;
      if ( this.$route.query.category && !this.selectedCategory ) {
        const selectedCategory = categoryList.find( ( category ) => {
          return category.slug === queryCategory
            || category._id === queryCategory;
        } ) || {};
        this.selectedCategory = selectedCategory;
      }
    },
    onSubmit() {
      if ( !this.selectedCategory ) {
        return Toast.open( {
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
          Toast.open( {
            message: 'Your topic has been posted.',
            type: 'is-primary',
          } );
        } )
        .catch( ( err ) => {
          console.error( err );
          Toast.open( {
            message: 'Oops! Could not create your topic at this moment. ' + err.error.message,
            type: 'is-danger',
          } );
          this.fetching = false;
        } );
    },
    onSelectCategory( selected ) {
      this.selectedCategory = selected;
    },
    handleTextChange( text ) {
      this.content = text;
    },
    onCancel( evt ) {
      evt.preventDefault();
      this.$router.go( -1 );
    },
  },
};
</script>
