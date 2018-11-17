<template>
  <div v-if="isAdmin()">
    <b-select
      placeholder="Moderator actions"
      v-model="selected"
      @input="onSelect"
      size="is-small"
      :loading="loading">
      <option v-for="option in options" :value="option">
        {{ option.name }}
      </option>
    </b-select>
  </div>

</template>

<script>
import api from '@/services/api.service'

function noop () {}

export default {
  props: {
    post: Object,
    isReply: Boolean
  },
  methods: {
    isAdmin () {
      return this.$store.state.auth.level.includes('admin')
    },
    onSelect (item) {
      item.callback()
      this.$nextTick(() => {
        this.selected = this.options[0]
        this.isComponentModalActive = true
      })
    },
    pinTopic () {
      this.$dialog.confirm({
        message: 'This will pin the topic to the top of the category. ' +
          'Are you sure you want to do this?',
        onConfirm: async () => {
          this.loading = true

          try {
            await api.pin(this.post)

            this.$store.commit('topics/pin', this.post)

            this.$toast.open({
              message: 'The topic is been pinned.',
              type: 'is-primary'
            })
          } catch (err) {
            this.$toast.open({
              message: 'Failed to pin the topic',
              type: 'is-danger'
            })
          }

          this.loading = false
        }
      })
    },
    unpinTopic () {
      this.$dialog.confirm({
        message: 'This will unpin the topic. ' +
          'Are you sure you want to do this?',
        onConfirm: async () => {
          this.loading = true

          try {
            console.log(this.post)
            await api.unpin(this.post)

            this.$store.commit('topics/unpin', this.post)

            this.$toast.open({
              message: 'The topic is been unpinned.',
              type: 'is-primary'
            })
          } catch (err) {
            console.error(err)
            this.$toast.open({
              message: 'Failed to unpin the topic',
              type: 'is-danger'
            })
          }

          this.loading = false
        }
      })
    }
  },
  data () {
    return {
      loading: false,
      options: [
        {
          name: '-- Moderator actions --',
          callback: noop
        },
        {
          name: 'Hide this post',
          callback: () => {
            this.$dialog.confirm({
              message: 'This will hide the post from users. ' +
                'Are you sure you want to do this?',
              onConfirm: () => this.$toast.open('User confirmed')
            })
          }
        }
      ],
      selected: null,
      isComponentModalActive: false,
      actions: {
        'pin': {
          name: 'Pin this topic',
          callback: this.pinTopic
        },
        'unpin': {
          name: 'Unpin this topic',
          callback: this.unpinTopic
        },
      }
    }
  },
  mounted () {
    this.selected = this.options[0]

    if (!this.isReply) {
      var action = this.post.pinned
        ? this.actions.unpin
        : this.actions.pin

      this.options.push(action)
    }
  }
}
</script>
