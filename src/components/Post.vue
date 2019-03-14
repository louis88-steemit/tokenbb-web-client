<template>
  <div class="post columns is-mobile box-styling">
    <div class="column is-12 post-body">
      <header class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <Avatar
              :author="data.author.user"
              :owner="data.author.owner_id"
              size="large"
            />
            <p class="username">
              {{ data.author.user | usernameDisplay(data.author.owner_id) }}
            </p>
            <div class="mod-display">
              <ModActions
                :post="data"
                :is-reply="isReply"
              />
            </div>
          </div>
        </div>
        <div class="level-right">
          <p class="level-item">
            <small>
              <DateTimeTag :time="data.createdAt" />
            </small>
          </p>
        </div>
      </header>

      <article
        v-if="!editing"
        class="content has-text-left"
        v-html="$renderMD(data.body)"
      />

      <form v-if="editing">
        <b-field>
          <b-input
            v-model="text"
            type="textarea"
            :loading="fetching"
            :disabled="fetching"
            placeholder="Type here."
          />
        </b-field>

        <b-field>
          <p class="control">
            <a
              class="button is-primary"
              :class="{ 'is-loading': this.fetching }"
              @click="onSave"
            >
              Save
            </a>
          </p>

          <p class="control">
            <a
              class="button"
              :disabled="this.fetching"
              @click="onCancel"
            >
              Cancel
            </a>
          </p>
        </b-field>
      </form>
      <ShowIfLoggedIn
        :hidden="true"
        class="quote-this"
      >
        <a @click="handleQuoteClick">Quote this</a>
        <a
          v-if="editable && !editing"
          class="button is-small has-icon"
          @click="onStartEditing"
        >
          <b-icon
            icon="square-edit-outline"
            size="is-small"
          />
          <span>Edit</span>
        </a>
      </ShowIfLoggedIn>
      <div class="level">
        <div class="level-left" />
        <div class="level-right">
          <div class="level-item">
            <Upvote
              :votes="[]"
              :author="data.steem.author"
              :permlink="data.steem.permlink"
            />
          </div>
        </div>
        <div class="upvote-module">
          <Upvote
            :votes="[]"
            :author="data.steem.author"
            :permlink="data.steem.permlink"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import Field from 'buefy/src/components/field/Field';
import Input from 'buefy/src/components/input/Input';
import Icon from 'buefy/src/components/icon/Icon';

import Avatar from '../components/Avatar.vue';
import Upvote from '../components/Upvote.vue';
import ModActions from '../components/ModActions.vue';
import { publishEdit } from '../services/api.service.js';
import { errorAlertOptions } from '../utils/notifications.js';
import ShowIfLoggedIn from '../components/ShowIfLoggedIn.vue';
import DateTimeTag from '../components/DateTimeTag';

import { Toast } from 'buefy/dist/components/toast';

export default {
  components: {
    BField: Field,
    BInput: Input,
    BIcon: Icon,
    Avatar,
    Upvote,
    ModActions,
    ShowIfLoggedIn,
    DateTimeTag,
  },
  props: {
    data: Object,
    isReply: Boolean,
  },
  data() {
    return {
      fetching: false,
      editing: false,
      text: '',
    };
  },
  computed: {
    editable() {
      return this.$store.state.auth.accounts.find( ( account ) => account.user_id === this.data.author.owner_id );
    },
    steemitLink() {
      return `https://steemit.com/@${this.data.steem.author}/${this.data.steem.permlink}`;
    },
  },
  mounted() {
  },
  methods: {
    avatarURL( author ) {
      return 'https://img.busy.org/@' + author;
    },
    onStartEditing() {
      this.text = this.data.body;
      this.editing = true;
    },
    onSave() {
      this.fetching = true;

      publishEdit( this.data, { content: this.text } )
        .then( ( post ) => {
          this.data.body = post.body;
          this.editing = false;
          this.fetching = false;
        } )
        .catch( ( err ) => {
          console.error( err );
          Toast.open( errorAlertOptions( 'Oops! Could not edit your post at this moment' ) );
          this.fetching = false;
        } );
    },
    onCancel() {
      if ( this.fetching ) {
        return;
      }

      this.text = '';
      this.editing = false;
    },
    handleQuoteClick() {
      this.$root.$emit( 'quote-click', this.data );
      this.scrollTo( 'endOfTopic' );
    },
    scrollTo( id ) {
      window.scrollTo( 0, document.getElementById( id ).offsetTop );
    },
  },
};
</script>
