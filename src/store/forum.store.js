import { Toast } from 'buefy/dist/components/toast';

import {
  listRoles,
  setCategoryOrdering,
  getUsers,
  modifyForumPermission,
} from '../services/api.service.js';
import { errorAlertOptions } from '../utils/notifications.js';

async function sendModifyForumPermission( commit, action, type, username ) {
  commit( 'setFetching', true );
  try {
    await modifyForumPermission( action, type, username );
  } catch ( err ) {
    Toast.open( errorAlertOptions( `Error with forum ${type} ${action} for ${username}`, err ) );
    console.error( err );
  } finally {
    commit( 'setFetching', false );
  }
}

export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryOrdering: Object,
    owners: [],
    mods: [],
    ownerData: [],
    modData: [],
    token: {
      enabled: false,
      symbol: '',
      precision: 3,
    },
  },
  mutations: {
    setFetching( state, fetching ) {
      state.fetching = fetching;
    },
    updateForum( state, forum ) {
      try {
        state.categoryOrdering = JSON.parse( forum.categoryOrdering );
      } catch ( e ) {
        console.error( `Invalid categoryOrdering JSON ${forum.categoryOrdering}: `, e );
        state.categoryOrdering = {};
      }
      state.owners = forum.owners;
      state.mods = forum.mods;
      if ( forum.ownerData ) {
        state.ownerData = forum.ownerData;
      }
      if ( forum.modData ) {
        state.modData = forum.modData;
      }
      state.token.enabled = Boolean( forum.token && forum.token.SCOT );
      state.token.symbol = ( forum.token && forum.token.symbol ) || '';
      state.token.precision = ( forum.token && forum.token.precision ) || 3;
      this.commit( 'categories/updateCategoryOrderingData' );
    },
  },
  getters: {
    getRoles( { owners, mods } ) {
      return {
        owners,
        mods,
      };
    },
    getCategoryOrdering( { categoryOrdering } ) {
      return categoryOrdering;
    },
  },
  actions: {
    async fetch( { commit }, withModData ) {
      commit( 'setFetching', true );

      try {
        const forum = await listRoles();

        if ( withModData ) {
          forum.data.ownerData = ( await getUsers( forum.data.owners ) ).data.users;
          forum.data.modData = ( await getUsers( forum.data.mods ) ).data.users;
        }

        commit( 'updateForum', forum.data );

        commit( 'setFetching', false );
      } catch ( err ) {
        commit( 'setFetching', false );
        Toast.open( errorAlertOptions( 'Error fetching forum', err ) );
        console.error( err );
      }
    },
    async editCategoryOrdering( { commit }, categoryOrdering ) {
      commit( 'setFetching', true );
      try {
        await setCategoryOrdering( categoryOrdering );
      } catch ( err ) {
        Toast.open( errorAlertOptions( 'Error editing category ordering', err ) );
        console.error( err );
      } finally {
        commit( 'setFetching', false );
      }
    },
    async addForumAdmin( { commit }, username ) {
      await sendModifyForumPermission( commit, 'add', 'admin', username );
    },
    async removeForumAdmin( { commit }, username ) {
      await sendModifyForumPermission( commit, 'remove', 'admin', username );
    },
    async addForumMod( { commit }, username ) {
      await sendModifyForumPermission( commit, 'add', 'mod', username );
    },
    async removeForumMod( { commit }, username ) {
      await sendModifyForumPermission( commit, 'remove', 'mod', username );
    },
  },
};
