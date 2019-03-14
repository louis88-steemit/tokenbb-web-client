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
    <template v-if="this.numberOfReplies > 0">
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
    lastReply: {
      time: String,
      author: String,
      owner: String,
    },
    numberOfReplies: Number,
  },
  computed: {
    timeFromNow() {
      return formatDateTimeFromNow( this.lastReply.time );
    },
  },
};
</script>
