<template>
  <div class="container">
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <CategoryDropdown
            :selectedId="selectedCategoryId"
            @change="onSelectCategoryId">
          </CategoryDropdown>
        </div>
      </div>

      <div class="level-right">
        <div class="level-item">
          <router-link
            v-if="loggedIn"
            to="/new"
            class="button is-primary has-icon">
            New Topic
          </router-link>
        </div>
      </div>
    </nav>

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
          <Avatar :author="props.row.author.user" size="medium"></Avatar>
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
        <b-table-column field="numberOfReplies" label="Last Reply">
          <template v-if="props.row.numberOfReplies > 0">
            <Avatar :author="props.row.lastReply.author" size="medium"></Avatar>
            {{ props.row.lastReply.preview }}
          </template>
        </b-table-column>
      </template>

    </b-table>
  </div>
</template>

<style lang="scss">
@import '@/variables.scss';

.b-table tr.pinned {
  color: $pinned-color;
  background-color: $pinned-background-color;
  a {
    color: $pinned-color;
  }
  a:hover {
    color: $pinned-color;
  }
}
tr.pinned td > span > a {
  font-weight: bold;
}
tr.pinned td > span > a > span.tag {
  font-weight: normal;
}
</style>

<script>
import CategoryTag from '@/components/CategoryTag.vue'
import { mapState } from 'vuex'

import CategoryDropdown from '@/components/CategoryDropdown.vue'
import Avatar from '@/components/Avatar.vue'

export default {
  name: 'home',
  components: {
    CategoryDropdown,
    Avatar,
    CategoryTag
  },
  computed: {
    ...mapState('topics', [
      'fetching',
      'list'
    ]),
    ...mapState('categories', [
      'categoriesBySlug'
    ]),
    loggedIn () {
      return this.$store.state.auth.username
    },
    topicList () {
      if (!this.selectedCategoryId) {
        return this.$store.state.topics.topicList
      }

      return this.$store.state.topics.topicList.filter(topic => {
        return topic.categoryId === this.selectedCategoryId
      })
    },
  },
  beforeRouteUpdate (to, from, next) {
    this.selectedCategoryId = to.query.category || null

    next()
  },
  mounted () {
    this.$store.dispatch('categories/fetchAll')
      .then(()=>this.$store.dispatch('topics/fetchAll'))
      .then(()=>this.selectedCategoryId = this.$router.currentRoute.query.category || null)
  },
  data () {
    return {
      selectedCategoryId: null,
      selected: null
    }
  },
  methods: {
    getRowClass (row) {
      return row.pinned ? 'pinned' : ''
    },
    onSelectCategoryId (id) {
      this.$router.push({
        path: '/',
        query: id
          ? { category: id }
          : {}
      })
    },
    topicRoute (topic) {
      return `/topics/${topic.author.user}/${topic.permlink}`
    }
  }
}
</script>
