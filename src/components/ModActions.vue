<template>
  <div v-if="isAdmin()">
    <b-select
      placeholder="Moderator actions"
      v-model="selected"
      @input="onSelect"
      size="is-small"
      :loading="loading">
      <option v-for="(option, index) in options" :value="option" :key="index">
        {{ option.name }}
      </option>
    </b-select>
  </div>

</template>

<script>
import { hide, pin, unpin } from '../services/api.service.js';

function noop() {}

export default {
  props: {
    post: Object,
    isReply: Boolean,
  },
  methods: {
    isAdmin() {
      return this.$store.state.auth.roles.admin;
    },
    onSelect( item ) {
      item.callback();
      this.$nextTick( () => {
        this.selected = this.options[0];
        this.isComponentModalActive = true;
      } );
    },
    pinTopic() {
      this.$dialog.confirm( {
        message: 'This will pin the topic to the top of the category. '
          + 'Are you sure you want to do this?',
        onConfirm: async () => {
          this.loading = true;

          try {
            await pin( this.post );

            this.$store.commit( 'topics/pin', this.post );

            this.$toast.open( {
              message: 'The topic has been pinned.',
              type: 'is-primary',
            } );
            this.$router.push( { name: 'home' } );
          } catch ( err ) {
            const result = err.error.message;
            this.$toast.open( {
              message: `Failed to pin the topic: ${result}`,
              type: 'is-danger',
            } );
          }

          this.loading = false;
        },
      } );
    },
    unpinTopic() {
      this.$dialog.confirm( {
        message: 'This will unpin the topic. '
          + 'Are you sure you want to do this?',
        onConfirm: async () => {
          this.loading = true;

          try {
            await unpin( this.post );

            this.$store.commit( 'topics/unpin', this.post );

            this.$toast.open( {
              message: 'The topic has been unpinned.',
              type: 'is-primary',
            } );
            this.$router.push( { name: 'home' } );
          } catch ( err ) {
            const result = err.error.message;
            this.$toast.open( {
              message: `Failed to unpin the topic: ${result}`,
              type: 'is-danger',
            } );
          }

          this.loading = false;
        },
      } );
    },
    hideTopic() {
      this.$dialog.confirm( {
        message: 'This will hide the post from users. '
                + 'Are you sure you want to do this?',
        onConfirm: async () => {
          this.loading = true;

          try {
            await hide( this.post );

            this.$toast.open( {
              message: 'The post has been hidden.',
              type: 'is-primary',
            } );
            this.$router.push( { name: 'home' } );
          } catch ( err ) {
            const result = err.error.message;
            this.$toast.open( {
              message: `Failed to hide the post: ${result}`,
              type: 'is-danger',
            } );
          }

          this.loading = false;
        },
      } );
    },
  },
  data() {
    return {
      loading: false,
      options: [
        {
          name: '-- Moderator actions --',
          callback: noop,
        },
        {
          name: 'Hide this post',
          callback: this.hideTopic,
        },
      ],
      selected: null,
      isComponentModalActive: false,
      actions: {
        'pin': {
          name: 'Pin this topic',
          callback: this.pinTopic,
        },
        'unpin': {
          name: 'Unpin this topic',
          callback: this.unpinTopic,
        },
      },
    };
  },
  mounted() {
    this.selected = this.options[0];

    if ( !this.isReply ) {
      const action = this.post.pinned
        ? this.actions.unpin
        : this.actions.pin;

      this.options.push( action );
    }
  },
};
</script>
