import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions } from 'vuex'
import store from '../../store/modules/new_forum'

export default {
  name: 'NewForumPage',
  async preFetch ({ store }) {
    store.registerModule('new_forum', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('new_forum', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('new_forum')
  },
  computed: {
    ...mapStateAndMutations('new_forum', ['fetching', 'name'])
  },
  methods: {
    ...mapActions('new_forum', ['init', 'onSubmit'])
  }
}
