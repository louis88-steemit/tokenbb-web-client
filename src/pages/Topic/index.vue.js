import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions, mapGetters } from 'vuex'
import store from '../../store/pages/topic'

export default {
  name: 'TopicPage',
  async preFetch ({ store }) {
    store.registerModule('page_topic', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('page_topic', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('page_topic')
  },
  computed: {
    ...mapStateAndMutations('page_topic', ['fetching', 'topic', 'replyText']),
    ...mapGetters('page_topic', ['categoryFromId'])
  },
  methods: {
    ...mapActions('page_topic', ['init', 'onReplySubmit', 'fetchTopic', 'onReplyInput'])
  }
}
