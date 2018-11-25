<template>
  <div class="container fill">
    <h2 class="title is-2">Create a New Forum</h2>

    <form @submit.prevent="onSubmit" class="new-forum">
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <b-field label="Name">
              <b-input v-model="name" placeholder="Type name here">
              </b-input>
            </b-field>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button role="submit"
            :class="{ 'is-loading': fetching }"
            class="button is-primary">
            Create Forum
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { createForum } from '../services/api.service.js';

export default {
  name: 'new-forum',
  components: {
  },
  data () {
    return {
      fetching: false,
      name: '',
    }
  },
  methods: {
    onSubmit () {
      if (this.name.length < 3) {
        return this.$toast.open({
          type: 'is-danger',
          message: 'Please write title and slug'
        })
      }

      this.fetching = true

      createForum(this.name)
        .then((forum) => {
          window.location = `https://${forum.data.slug}.${process.env.VUE_APP_BASE_PATH}/settings`;
        })
        .catch(err => {
          console.error(err)
          this.$toast.open({
            message: 'Oops! Could not create your forum at this moment. ' + err,
            type: 'is-danger'
          })
          this.fetching = false
        })
    },
  }
}
</script>
