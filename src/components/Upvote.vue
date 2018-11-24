<template>
  <ShowIfLoggedIn :hidden="true" class="upvote">
    <b-dropdown position="is-top-right" hoverable>
      <div class="field has-addons" slot="trigger">
        <p class="control">
          <a class="button is-small is-static">{{ votes.length }}</a>
        </p>
        <p class="control">
          <a class="button is-primary is-small"
            :class="{ 'is-loading': this.fetching }"
            @click="handleClick">
            <span>Upvote</span>
            <b-icon icon="arrow-up-drop-circle-outline" size="is-small">
            </b-icon>
          </a>
        </p>
      </div>

      <b-dropdown-item custom>
        <div class="container popover">
          <div class="columns">
            <div class="column is-3 vertical">
              <span class="percent-label">{{ percent }}%</span>
            </div>
            <div class="column is-6">
              <input class="slider is-primary is-circle"
                ref="slider"
                @input="handleChange"
                step="1"
                min="0"
                max="100"
                :value="percent"
                type="range">
            </div>
          </div>
        </div>

      </b-dropdown-item>
    </b-dropdown>
  </ShowIfLoggedIn>
</template>

<script>
import steem from '@/services/steem.service.js'

import ShowIfLoggedIn from '@/components/ShowIfLoggedIn.vue'

export default {
  components: {
    ShowIfLoggedIn
  },
  props: {
    author: String,
    permlink: String,
    votes: Array
  },
  data () {
    return {
      percent: 10,
      fetching: false
    }
  },
  methods: {
    handleChange () {
      this.percent = this.$refs.slider.value
    },
    async handleClick () {
      this.fetching = true

      try {
        await steem.vote(this.author, this.permlink, this.percent)
        this.$toast.open({
          message: 'Upvoted!',
          type: 'is-primary'
        })
        this.votes.length++
      } catch (err) {
        console.error('oops!', err)
        this.$toast.open({
          message: 'Oops! Could not upvote at this time.',
          type: 'is-danger'
        })
      }

      this.fetching = false
    }
  }
}
</script>
