<template>
  <div class="container fill">
    <h2 class="title is-2">
      Create a New Forum
    </h2>

    <form
      class="new-forum"
      @submit.prevent="onSubmit"
    >
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <b-field label="Name">
              <b-input
                v-model="name"
                placeholder="Type name here"
              />
            </b-field>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button
            role="submit"
            :class="{ 'is-loading': fetching }"
            class="button is-primary"
          >
            Create Forum
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import Field from 'buefy/src/components/field/Field';
import Input from 'buefy/src/components/input/Input';

import { createForum } from '../services/api.service.js';

export default {
  name: 'NewForum',
  components: {
    BField: Field,
    BInput: Input,
  },
  data() {
    return {
      fetching: false,
      name: '',
    };
  },
  methods: {
    onSubmit() {
      if ( this.name.length < 1 ) {
        return this.$toast.open( {
          type: 'is-danger',
          message: 'Please write a forum name',
        } );
      }

      this.fetching = true;

      createForum( this.name )
        .then( ( forum ) => {
          window.location = `https://${forum.data.slug}.${process.env.VUE_APP_BASE_PATH}/settings`;
        } )
        .catch( ( err ) => {
          console.error( err );
          this.$toast.open( {
            message: 'Oops! Could not create your forum at this moment. ' + err,
            type: 'is-danger',
          } );
          this.fetching = false;
        } );
    },
  },
};
</script>
