<template>
  <ShowIfLoggedIn :hidden="true">
    <div class="columns upvote-module">
      <span class="column upvote-stats">
        <span>$ {{ value }}</span>
      </span>
      <span class="column upvote-stats">
        <span>{{ votes.length }} Votes</span>
      </span>
      <span class="column upvote-button">
        <b-dropdown
          position="is-top-left"
          hoverable
          :disabled="voted"
        >
          <span
            slot="trigger"
            class="upvote-slider"
          >
            <a
              class="is-small"
              :class="{ 'is-loading': this.fetching }"
              :disabled="voted"
              @click="handleClick"
            >
              <!--<span>Upvote</span>-->
              <b-icon
                icon="arrow-up-drop-circle-outline"
                size="is-medium"
              />
            </a>
          </span>
          <b-dropdown-item custom>
            <div class="columns popup-upvote">
              <div class="column is-1 percent-label">
                <span>{{ percent }}%</span>
              </div>
              <div class="column is-4">
                <input
                  ref="slider"
                  orient="horizontal"
                  class="slider is-primary is-circle"
                  step="1"
                  min="0"
                  max="100"
                  :value="percent"
                  type="range"
                  @input="handleChange"
                >
              </div>
              <div class="column is-1">
                <a
                  class="is-small upvote-dropdownbutton"
                  :class="{ 'is-loading': this.fetching }"
                  :disabled="voted"
                  @click="handleClick"
                >
                  <!--<span>Upvote</span>-->
                  <b-icon
                    icon="arrow-up-drop-circle-outline"
                    size="is-medium"
                  />
                </a>
              </div>
            </div>
          </b-dropdown-item>
        </b-dropdown>
      </span>
    </div>
  </ShowIfLoggedIn>
</template>

<script>

import Dropdown from 'buefy/src/components/dropdown/Dropdown';
import DropdownItem from 'buefy/src/components/dropdown/DropdownItem';
import Icon from 'buefy/src/components/icon/Icon';

import { Client } from 'dsteem';

import { vote } from '../services/api.service.js';
import ShowIfLoggedIn from './ShowIfLoggedIn.vue';

import Timeout from 'await-timeout';

import { Toast } from 'buefy/dist/components/toast';

const client = new Client( 'https://api.steemit.com' );

export default {
  components: {
    BDropdown: Dropdown,
    BDropdownItem: DropdownItem,
    BIcon: Icon,
    ShowIfLoggedIn,
  },
  props: {
    author: String,
    permlink: String,
  },
  data() {
    return {
      percent: 10,
      fetching: false,
      paid: 0,
      value: '0.000',
      votes: [],
    };
  },
  computed: {
    voted() {
      return this.paid > 0
        || this.$store.state.auth.current === 'anon'
        || this.votes.filter( ( _vote ) => _vote.voter === this.$store.state.auth.current ).length > 0;
    },
  },
  mounted() {
    this.updateValue();
  },
  methods: {
    handleChange() {
      this.percent = this.$refs.slider.value;
    },
    async updateValue() {
      const data = await client.call( 'condenser_api', 'get_content', [ this.author, this.permlink ] );
      const pending = parseFloat( data.pending_payout_value.split( ' ' )[0] );
      this.paid = parseFloat( data.total_payout_value.split( ' ' )[0] );
      this.value = ( this.paid + pending ).toFixed( 3 );
      this.votes = data.active_votes;
    },
    async handleClick() {
      if ( this.voted ) {
        return Toast.open( {
          message: 'Oops! Already voted!.',
          type: 'is-danger',
        } );
      }
      this.fetching = true;

      try {
        await vote( this.author, this.permlink, this.$store.state.auth.current, this.percent );
        Toast.open( {
          message: 'Upvoted!',
          type: 'is-primary',
        } );
        await Timeout.set( 3000 );
        await this.updateValue();
      } catch ( err ) {
        console.error( 'oops!', err );
        Toast.open( {
          message: 'Oops! Could not upvote at this time. ' + err,
          type: 'is-danger',
        } );
      }
      this.fetching = false;
    },
  },
};
</script>
