import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions } from 'vuex'
import store from '../../store/pages/settings'

export default {
  name: 'SettingsPage',
  async preFetch ({ store }) {
    store.registerModule('page_settings', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('page_settings', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('page_settings')
  },
  computed: {
    ...mapStateAndMutations('page_settings', ['name', 'title', 'description'])
  },
  methods: {
    ...mapActions('page_settings', ['init', 'add', 'remove'])
  }
}
