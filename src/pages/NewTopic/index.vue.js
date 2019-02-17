import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions } from 'vuex'
import store from '../../store/pages/new_topic'

export default {
  name: 'NewTopicPage',
  async preFetch ({ store }) {
    store.registerModule('page_new_topic', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('page_new_topic', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('page_new_topic')
  },
  computed: {
    ...mapStateAndMutations('page_new_topic', ['fetching', 'selectedCategory', 'title', 'content'])
  },
  methods: {
    ...mapActions('page_new_topic', ['init', 'onSubmit', 'onSelectCategory', 'handleTextChange'])
  }
}
