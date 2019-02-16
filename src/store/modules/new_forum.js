import { Notify } from 'quasar'
import api from '../../services/api'

export default {
  namespaced: true,
  state: {
    fetching: false,
    name: ''
  },
  mutations: {
    fetching (state, value) { state.fetching = value },
    name (state, value) { state.name = value }
  },
  actions: {
    async onSubmit ({ state, commit }) {
      if (state.name.length < 3) {
        Notify.create({
          color: 'negative',
          message: 'Please write title and slug'
        })
      } else {
        commit('fetching', true)
        try {
          let forum = await api.createForum(state.name)
          window.location = `https://${forum.data.slug}.${process.env.VUE_APP_BASE_PATH}/settings`
        } catch (err) {
          Notify.create({
            color: 'negative',
            message: 'Oops! Could not create your forum at this moment. ' + err
          })
        } finally {
          commit('fetching', false)
        }
      }
    }
  }
}
