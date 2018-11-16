<template>
  <div class="container">
    <h2 class="title is-2">Create a New Topic</h2>

    <form @submit.prevent="onSubmit">
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <b-field label="Title">
              <b-input v-model="title" placeholder="Type title here">
              </b-input>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="Category">
              <CategoryDropdown
                @change="onSelectCategory"
                :selectedId="selectedCategoryId"
                :labelForAll="'Uncategorized'">
              </CategoryDropdown>
            </b-field>
          </div>
        </div>
      </div>

      <b-field label="Message">
        <TextEditor
          :fetching="fetching"
          @input="handleTextChange">
        </TextEditor>
      </b-field>

      <div class="field">
        <div class="control">
          <button role="submit"
            :class="{ 'is-loading': fetching }"
            class="button is-primary">
            Create Topic
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  width: 500px;
}
</style>

<script>
import TextEditor from '@/components/TextEditor.vue'
import CategoryDropdown from '@/components/CategoryDropdown.vue'

export default {
  name: 'new-topic',
  components: {
    TextEditor,
    CategoryDropdown
  },
  data () {
    return {
      fetching: false,
      selectedCategoryId: null,
      title: '',
      content: ''
    }
  },
  methods: {
    onSubmit () {
      if (!this.selectedCategoryId) {
        return this.$toast.open({
          type: 'is-danger',
          message: 'Please select a category'
        })
      }

      var payload = {
        title: this.title,
        category: this.selectedCategoryId,
        content: this.content
      }

      this.fetching = true

      this.$store.dispatch('topics/createTopic', payload)
        .then(topic => {
          this.$router.push(`/topics/${topic.author}/${topic.permlink}`)
          this.$toast.open({
            message: 'Your topic has been posted.',
            type: 'is-primary'
          })
        })
        .catch(err => {
          console.error(err)
          this.$toast.open({
            message: 'Oops! Could not create your topic at this moment.',
            type: 'is-danger'
          })
          this.fetching = false
        })
    },
    onSelectCategory (categoryId) {
      this.selectedCategoryId = categoryId
    },
    handleTextChange (text) {
      this.content = text
    }
  }
}
</script>
