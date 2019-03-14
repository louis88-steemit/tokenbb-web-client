<template>
  <div>
    <b-icon
      icon="clock"
      size="is-small"
    />
    {{ this.timeFromNow }}
    <template v-if="!this.time && this.numberOfReplies > 0">
      <span>by</span>
      <Avatar
        :author="this.lastReply.author"
        :owner="this.lastReply.owner"
        size="small"
      />
    </template>
  </div>
</template>

<script>

import Icon from 'buefy/src/components/icon/Icon';
import Avatar from '../components/Avatar.vue';
import { formatDateTimeFromNow } from '../utils/content';

export default {
  components: {
    BIcon: Icon,
    Avatar,
  },
  props: {
    time: String,
    lastReply: {
      time: String,
      author: String,
      owner: String,
    },
    numberOfReplies: Number,
  },
  data() {
    return {
      ticker: 0,
    };
  },
  computed: {
    timeFromNow() {
      const dummyTicker = this.$data.ticker;
      return formatDateTimeFromNow( this.time || this.lastReply.time );
    },
  },
  mounted() {
    const self = this;
    setInterval( function () {
      self.$data.ticker += 1;
    }, 1000 );
  },
};
</script>
