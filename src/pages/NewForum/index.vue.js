import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions } from 'vuex'
import store from '../../store/pages/new_forum'

export default {
  name: 'NewForumPage',
  async preFetch ({ store }) {
    store.registerModule('page_new_forum', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('page_new_forum', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('page_new_forum')
  },
  computed: {
    ...mapStateAndMutations('page_new_forum', ['fetching', 'name'])
  },
  methods: {
    ...mapActions('page_new_forum', ['init', 'onSubmit'])
  }
}
