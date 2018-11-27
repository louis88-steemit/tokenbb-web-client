import { editPost } from '../services/post.service.js';

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    editPost( {}, { post, content } ) {
      return editPost( post, content );
    },
  },
};
