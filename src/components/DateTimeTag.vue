<template>
  <b-tag-list attached>
    <b-tag type="is-secondary">
      <b-icon
        icon="clock"
        size="is-small"
      />
    </b-tag>
    <b-tag type="is-dark">
      {{ this.timeFromNow }}
    </b-tag>
    <template v-if="!this.time && this.numberOfReplies > 0">
      <b-tag type="is-black">
        <Avatar
          :author="this.lastReply.author"
          :owner="this.lastReply.owner"
          size="small"
        />
      </b-tag>
    </template>
  </b-tag-list>
</template>

<script>

import Icon from 'buefy/src/components/icon/Icon';
import Tag from 'buefy/src/components/tag/Tag';
import TagList from 'buefy/src/components/tag/Taglist';
import Avatar from '../components/Avatar.vue';
import { formatDateTimeFromNow } from '../utils/content';

export default {
  components: {
    BIcon: Icon,
    BTag: Tag,
    BTagList: TagList,
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
