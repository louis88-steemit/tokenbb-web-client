<template>
  <div class="container">
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <CategoryDropdown
            :selectedId="selectedCategoryId"
            @change="onSelectCategoryId"
            :labelForAll="'All Categories'">>
          </CategoryDropdown>
        </div>
      </div>

      <div class="level-right">
        <div class="level-item">
          <div class="topic-button-style">
          <router-link
            v-if="loggedIn"
            to="/new"
            class="button is-primary has-icon">
            New Topic
          </router-link>
          </div>
        </div>
      </div>
    </nav>
    <div class="main-content">
  <b-table
      :loading="fetching"
      :data="topicList"
      :row-class="getRowClass"
      :mobile-cards="false">

      <template slot-scope="props">
        <div class="content-box">
          <div class="content-box-left">
            <div>
              <Avatar :author="props.row.author.user"
                  :owner="props.row.author.owner_id"
                  size="large"></Avatar>
              </div>
          </div>
        <div class="content-box-middle">
        <div class="break-words">
          <router-link :to="topicRoute(props.row)">
            <h2><strong>{{ props.row.title }}</strong></h2>
          </router-link>
        </div>
        <span field="icon" width="0px" >
                <span class=" has-text-center" style="width: 100%">
                <b-icon
                  v-if="props.row.pinned"
                  icon="pin"
                  size="is-small">
                </b-icon>
              </span>
              </span>
          <span class="meta-box">
            <CategoryTag :categoryId="props.row.categoryId"></CategoryTag>
          </span>
        <span id="tiptop-control">
          <span class="tip tip-left" title="" data-original-title="Views"><b-icon icon="eye" size="is-small"></b-icon> {{ props.row.numberOfViews }}</span>
          <span class="tip tip-center" title="" data-original-title="Number of Replies"><b-icon icon="reply" size="is-small"></b-icon> {{ props.row.numberOfReplies }}</span>
          <span class="tip tip-right" title="" data-original-title="Last Reply"><b-icon icon="clock" size="is-small"></b-icon> {{ props.row.lastReply.time | fromNow }}</span>
        </span>
        </div>
        <div class="content-box-right">
        <div class="upvote-button">
          <Upvote
                  :votes="[]"
                  :author="props.row.steem.author"
                  :permlink="props.row.steem.permlink">
          </Upvote>
        </div>
        </div>
        </div>
      </template>

    </b-table>
    </div>
  </div>
</template>


<script>
import CategoryTag from '@/components/CategoryTag.vue';
import { mapState } from 'vuex';

import CategoryDropdown from '@/components/CategoryDropdown.vue';
import Upvote from '@/components/Upvote.vue';
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'home',
  components: {
    CategoryDropdown,
    Upvote,
    Avatar,
    CategoryTag,
  },
  computed: {
    ...mapState( 'topics', [
      'fetching',
      'list',
    ] ),
    ...mapState( 'categories', [
      'categoriesById',
      'categoryList',
    ] ),
    loggedIn() {
      return this.$store.state.auth.username;
    },
    topicList() {
      if ( !this.selectedCategoryId ) {
        return this.$store.state.topics.topicList;
      }

      return this.$store.state.topics.topicList.filter( ( topic ) => {
        return topic.categoryId === this.selectedCategoryId;
      } );
    },
  },
  beforeRouteUpdate( to, from, next ) {
    this.fetchCategory( to.query.category );

    next();
  },
  mounted() {
    this.$store.dispatch( 'categories/fetchAll' )
      .then( () => this.$store.dispatch( 'topics/fetchAll' ) )
      .then( () => {
        this.$nextTick( () => {
          const categoryParam = this.$router.currentRoute.query.category;
          const counter = parseInt( this.$router.currentRoute.query.i ) || 0;
          if ( categoryParam ) {
            this.$router.push( {
              path: '/',
              query: { category: categoryParam, i: counter + 1 },
            } );
            this.$nextTick( () => {
              this.$router.push( {
                path: '/',
                query: { category: categoryParam },
              } );
            } );
          }
        } );
      } );
  },
  data() {
    return {
      selectedCategoryId: null,
      selected: null,
    };
  },
  methods: {
    fetchCategory( categoryQuery ) {
      this.selectedCategoryId = categoryQuery || null;
      const selectedCategory = this.$store.state.categories.categoryList.find( ( category ) => {
        return category.slug === this.selectedCategoryId
               || category._id === this.selectedCategoryId;
      } ) || {};
      this.selectedCategoryId = selectedCategory._id;
    },
    getRowClass( row ) {
      return row.pinned ? 'pinned' : '';
    },
    onSelectCategoryId( selectedCategory ) {
      this.$router.push( {
        path: '/',
        query: selectedCategory
          ? { category: selectedCategory.slug }
          : {},
      } );
    },
    topicRoute( topic ) {
      return `/topics/${topic.author.user}/${topic.permlink}`;
    },
  },
};
</script>
