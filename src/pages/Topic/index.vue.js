import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions, mapGetters } from 'vuex'
import store from '../../store/modules/topic'

export default {
  name: 'TopicPage',
  async preFetch ({ store }) {
    store.registerModule('topic', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('topic', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('topic')
  },
  computed: {
    ...mapStateAndMutations('topic', ['fetching', 'topic', 'replyText']),
    ...mapGetters('topic', ['categoryFromId'])
  },
  methods: {
    ...mapActions('topic', ['init', 'onReplySubmit', 'fetchTopic', 'onReplyInput'])
  }
}
