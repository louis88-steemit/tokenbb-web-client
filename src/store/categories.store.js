import {} from '@/services/api.service';
import { addCategory, listCategories, removeCategory } from '../services/api.service.js';
import { errorAlertOptions } from '../utils/notifications.js';
import { Toast } from 'buefy/dist/components/toast';

export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryList: [],
    categoriesById: {},
    categoriesByBreadcrumb: { '__entries': [] },
  },
  mutations: {
    setFetching( state, fetching ) {
      state.fetching = fetching;
    },
    add( state, category ) {
      state.categoryList.push( category );
    },
    remove( state, category ) {
      const index = state.categoryList.findIndex( ( c ) => c._id === category._id );
      delete state.categoriesById[category._id];
      state.categoryList.splice( index, 1 );
    },
    updateCategoryList( state, categories ) {
      state.categoryList = categories;
      categories.forEach( ( category ) => {
        state.categoriesById[category._id] = category;
      } );

      // map category by breadcrumb
      categories.forEach( ( category ) => {
        if ( category.breadcrumb && category.breadcrumb.length > 0 ) {
          let categoryGroup = state.categoriesByBreadcrumb;
          for ( let idx = 0; idx < category.breadcrumb.length; idx++ ) {
            const crumb = category.breadcrumb[idx];
            if ( !categoryGroup[crumb] ) {
              categoryGroup[crumb] = { '__entries': [] };
            }
            categoryGroup = categoryGroup[crumb];
            if ( idx == category.breadcrumb.length - 1 ) {
              categoryGroup.__entries.push( category );
            }
          }
        } else {
          state.categoriesByBreadcrumb.__entries.push( category );
        }
      } );
      console.log( state.categoriesByBreadcrumb );

      // For Vue Reactivity.
      state.categoriesByBreadcrumb = { ...state.categoriesByBreadcrumb };
      state.categoriesById = { ...state.categoriesById };
    },
  },
  actions: {
    add( { commit }, { name: categoryName, title, description, breadcrumb } ) {
      commit( 'setFetching', true );

      addCategory( categoryName, title, description, breadcrumb )
        .then( ( category ) => {
          commit( 'add', category.data );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );
          Toast.open( errorAlertOptions( `Error adding category ${categoryName}`, err ) );
          console.error( err );
        } );
    },
    remove( { commit }, category ) {
      commit( 'setFetching', true );

      removeCategory( category.name )
        .then( () => {
          commit( 'remove', category );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );
          Toast.open( errorAlertOptions( `Error removing category ${category.name}`, err ) );
          console.error( err );
        } );
    },
    fetchAll( { commit } ) {
      commit( 'setFetching', true );

      listCategories()
        .then( ( categories ) => {
          commit( 'updateCategoryList', categories.data );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );
          Toast.open( errorAlertOptions( 'Error fetching categories', err ) );
          console.error( err );
        } );
    },
  },
};
