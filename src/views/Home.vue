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
            v-if="loggedIn && selectedCategoryId"
            to="/new"
            class="button is-primary has-icon">
            New Topic
          </router-link>
          </div>
        </div>
      </div>
    </nav>

    <div v-show="!selectedCategoryId">
    <b-table
      :data="categoryList"
      :loading="fetching"
      mobile-cards
      striped>

      <template slot-scope="cprops">
        <b-table-column field="title" label="Title">
          <a @click="onSelectCategoryId( cprops.row )">
            {{ cprops.row.title }}
          </a>
        </b-table-column>
        <b-table-column field="description" label="Description">
          {{ cprops.row.description }}
        </b-table-column>
        <b-table-column field="last_activity" label="Last Activity">
          {{ cprops.row.meta ? cprops.row.meta.last_action.time : '' }}
        </b-table-column>
        <b-table-column field="last_user" label="Last User">
          {{ cprops.row.meta ? cprops.row.meta.last_action.author : '' }}
        </b-table-column>
        <b-table-column field="topics" label="Topics">
          {{ cprops.row.meta ? cprops.row.meta.topics : '' }}
        </b-table-column>
        <b-table-column field="replies" label="Replies">
          {{ cprops.row.meta ? cprops.row.meta.replies : '' }}
        </b-table-column>
        <b-table-column field="views" label="Views">
          {{ cprops.row.meta ? cprops.row.meta.views : '' }}
        </b-table-column>
      </template>
    </b-table>
    </div>

    <div v-show="selectedCategoryId">
    <b-table
      :loading="fetching"
      :data="topicList"
      :row-class="getRowClass"
      :mobile-cards="false"
      striped>

      <template slot-scope="props">
        <b-table-column field="icon" width="0px" >
          <div class=" has-text-center" style="width: 100%">
          <b-icon
            v-if="props.row.pinned"
            icon="pin"
            size="is-small">
          </b-icon>
          </div>
        </b-table-column>
        <b-table-column field="title" label="Topic">
          <router-link :to="topicRoute(props.row)">
            {{ props.row.title }}
          </router-link>
        </b-table-column>
        <b-table-column field="author" label="Author">
          <Avatar :author="props.row.author.user"
                  :owner="props.row.author.owner_id"
                  size="medium"></Avatar>
        </b-table-column>
        <b-table-column field="categoryId" label="Category">
          <CategoryTag :categoryId="props.row.categoryId">
          </CategoryTag>
        </b-table-column>
        <b-table-column field="numberOfReplies" label="Replies">
          {{ props.row.numberOfReplies }}
        </b-table-column>
        <b-table-column field="numberOfViews" label="Views">
          {{ props.row.numberOfViews }}
        </b-table-column>
        <b-table-column field="numberOfReplies" label="Last Activity">
          {{ props.row.lastReply.time | fromNow }}
        </b-table-column>
        <b-table-column field="numberOfReplies" label="User">
          <template v-if="props.row.numberOfReplies > 0">
            <Avatar :author="props.row.lastReply.author"
                    :owner="props.row.lastReply.owner"
                    size="medium"></Avatar>
          </template>
        </b-table-column>
        <b-table-column field="numberOfVotes" label="Votes">
          <Upvote
                  :votes="[]"
                  :author="props.row.steem.author"
                  :permlink="props.row.steem.permlink">
          </Upvote>
        </b-table-column>
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
      'topicList',
    ] ),
    ...mapState( 'categories', [
      'categoryList',
    ] ),
    loggedIn() {
      return this.$store.state.auth.username;
    },
    fetching() {
      return this.$store.state.topics.fetching || this.$store.state.categories.fetching;
    },

    /* topicList() {
      //if ( !this.selectedCategoryId ) {
      console.log(this.$store.state.topics.topicList);
        return this.$store.state.topics.topicList;
      //}

      //return this.$store.state.topics.topicList.filter( ( topic ) => {
      //  return topic.categoryId === this.selectedCategoryId;
      //} );
    },*/
  },
  beforeRouteUpdate( to, from, next ) {
    if ( to.query.category ) {
      this.$store.dispatch( 'topics/fetchAll', { category: to.query.category } );
    } else {
      this.selectedCategoryId = null;
    }
    next();
  },
  data() {
    return {
      selectedCategoryId: null,
      selected: null,
    };
  },
  watch: {
    categoryList( value ) {
      const queryCategory = this.$route.query.category;
      if ( this.$route.query.category && !this.selectedCategoryId ) {
        const selectedCategory = this.$store.state.categories.categoryList.find( ( category ) => {
          return category.slug === queryCategory
            || category._id === queryCategory;
        } ) || {};
        this.selectedCategoryId = selectedCategory._id;
      }
    },
  },
  methods: {
    getRowClass( row ) {
      return row.pinned ? 'pinned' : '';
    },
    onSelectCategoryId( selectedCategory ) {
      this.selectedCategoryId = selectedCategory ? selectedCategory._id : null;
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
