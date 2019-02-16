import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions } from 'vuex'
import store from '../../store/modules/new_topic'

export default {
  name: 'NewTopicPage',
  async preFetch ({ store }) {
    store.registerModule('new_topic', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('new_topic', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('new_topic')
  },
  computed: {
    ...mapStateAndMutations('new_topic', ['fetching', 'selectedCategory', 'title', 'content'])
  },
  methods: {
    ...mapActions('new_topic', ['init', 'onSubmit', 'onSelectCategory', 'handleTextChange'])
  }
}
