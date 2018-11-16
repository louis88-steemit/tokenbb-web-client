<template>
  <div class="container">
    <h2 class="title is-4">Settings</h2>

    <h3 class="title is-5">Categories</h3>

    <b-table
      :data="categoryList"
      striped
      hoverable
      mobile-cards>

      <template slot-scope="props">
        <b-table-column field="id" label="Id" width="40" numeric>
          {{ props.row.id }}
        </b-table-column>

        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column label="Delete" centered>
          
          <a class="button is-small"
            :class="{ 'is-loading': fetching }" 
            @click="remove(props.row.id)">
            <b-icon
              icon="close-circle"
              size="is-small">
            </b-icon>
          </a>
        </b-table-column>
      </template>
    </b-table>

    <hr>

    <h3 class="title is-5">Add a category</h3>

    <div class="columns">
      <div class="column">
        <form @submit.prevent="add">
          <b-field label="Category Name">
            <b-input 
              v-model="name"
              :maxlength="32"
              :has-counter="false"
              :disabled="fetching">  
            </b-input>
          </b-field>

          <button role="submit"
            class="button" 
            :class="{ 'is-loading': fetching }"
            :disabled="fetching">
            Add
          </button>
        </form>
      </div>
      <div class="column">
        
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'settings',
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapState('categories', [
      'categoryList',
      'fetching'
    ])
  },
  methods: {
    add () {
      this.$store.dispatch('categories/add', this.name)
        .then(() => {
          this.name = ''
        })
        .catch(err => {
          console.error(err)
          this.fetching = false
        })
    },
    remove (category) {
      this.$store.dispatch('categories/remove', category)
        .catch(err => {
          console.error(err)
          this.fetching = false
        })
    }
  }
}
</script>
