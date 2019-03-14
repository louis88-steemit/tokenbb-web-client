<template>
  <div class="container home">
    <div class="level is-mobile">
      <div class="level-left">
        <CategoryDropdown
          :selected-id="selectedCategoryId"
          :label-for-all="'All Categories'"
          @change="onSelectCategoryId"
        />
      </div>
      <div class="level-right">
        <router-link
          v-if="loggedIn"
          :to="{ path: 'new', query: { category: this.$route.query.category ? this.$route.query.category : null } }"
        >
          <button class="button is-small is-topic">
            New Topic
          </button>
        </router-link>>
      </div>
    </div>
    <b-table
      :loading="fetching"
      :data="topicList"
      :row-class="getRowClass"
      :mobile-cards="false"
    >
      <template slot-scope="props">
        <div class="box is-mobile">
          <article class="media is-mobile">
            <figure class="media-left">
              <p class="image is-64x64">
                <Avatar
                  :author="props.row.author.user"
                  :owner="props.row.author.owner_id"
                  size="large"
                />
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <router-link :to="topicRoute(props.row)">
                  <h2 class="title is-6">
                    {{ props.row.title }}
                  </h2>
                </router-link>
              </div>
              <b-field grouped>
                <b-tag-list attached>
                  <b-tag
                    v-if="props.row.pinned"
                    type="is-secondary"
                  >
                    <b-icon
                      icon="pin"
                      size="is-small"
                    />
                  </b-tag>
                </b-tag-list>
                <CategoryTag :category-id="props.row.categoryId" />
                <Upvote
                  :votes="[]"
                  :author="props.row.steem.author"
                  :permlink="props.row.steem.permlink"
                />
                <b-tag-list attached>
                  <b-tag type="is-secondary">
                    <b-icon
                      icon="eye"
                      size="is-small"
                    />
                  </b-tag>
                  <b-tag type="is-dark">
                    {{ props.row.numberOfViews }}
                  </b-tag>
                </b-tag-list>
                <b-tag-list attached>
                  <b-tag type="is-secondary">
                    <b-icon
                      icon="reply"
                      size="is-small"
                    />
                  </b-tag>
                  <b-tag type="is-dark">
                    {{ props.row.numberOfReplies }}
                  </b-tag>
                </b-tag-list>
                <DateTimeTag
                  :last-reply="props.row.lastReply"
                  :number-of-replies="props.row.numberOfReplies"
                />
                <!-- Hotfix for css bug of last tag breaking down, invisible last tag -->
                <b-tag-list attached />
              </b-field>
            </div>
          </article>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>

import { mapState } from 'vuex';

import Icon from 'buefy/src/components/icon/Icon';
import Table from 'buefy/src/components/table/Table';
import Tag from 'buefy/src/components/tag/Tag';
import TagList from 'buefy/src/components/tag/Taglist';
import Field from 'buefy/src/components/field/Field';
import CategoryTag from '../components/CategoryTag.vue';
import CategoryDropdown from '../components/CategoryDropdown.vue';
import Upvote from '../components/Upvote.vue';
import Avatar from '../components/Avatar.vue';
import DateTimeTag from '../components/DateTimeTag';

export default {
  name: 'Home',
  components: {
    DateTimeTag,
    BIcon: Icon,
    BTag: Tag,
    BTagList: TagList,
    BField: Field,
    BTable: Table,
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
        const selectedCategory = value.find( ( category ) => {
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
      this.selectedCategoryId = selectedCategory._id;
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

