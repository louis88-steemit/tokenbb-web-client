import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions, mapGetters } from 'vuex'
import store from '../../store/pages/new_forum'

export default {
  name: 'NewForumPage',
  async preFetch ({ store }) {
    store.registerModule('page_home', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('page_home', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('page_home')
  },
  computed: {
    ...mapStateAndMutations('page_home', ['selectedCategoryId', 'selected']),
    ...mapGetters('page_home', ['getRowClass', 'topicRoute'])
  },
  methods: {
    ...mapActions('page_home', ['init', 'fetchCategory', 'onSelectCategoryId'])
  }
}
