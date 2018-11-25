import { createReply } from '../services/post.service.js';

export default {
  namespaced: true,
  state: {
    fetching: false,
  },
  mutations: {
    setFetching( state, fetching ) {
      state.fetching = fetching;
    },
  },
  actions: {
    submitReply( { commit }, { parent, content } ) {
      commit( 'setFetching', true );

      const author = this.state.auth.current;

      return createReply( parent, author, content )
        .then( ( reply ) => {
          commit( 'setFetching', false );

          return reply;
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );

          console.error( err );
        } );
    },
  },
};
