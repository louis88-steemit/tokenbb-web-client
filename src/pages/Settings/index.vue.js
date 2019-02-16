import { mapStateAndMutations } from '../../utils/mapper'
import { mapActions } from 'vuex'
import store from '../../store/modules/settings'

export default {
  name: 'SettingsPage',
  async preFetch ({ store }) {
    store.registerModule('settings', store, { ignoreIfExists: true })
    await store.dispatch('init')
  },
  created () {
    this.$store.registerModule('settings', store, { preserveState: true })
  },
  destroyed () {
    this.$store.unregisterModule('settings')
  },
  computed: {
    ...mapStateAndMutations('settings', ['name', 'title', 'description'])
  },
  methods: {
    ...mapActions('settings', ['init', 'add', 'remove'])
  }
}
