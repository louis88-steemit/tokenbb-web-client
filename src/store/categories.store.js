import { Toast } from 'buefy/dist/components/toast';

import { addCategory, listCategories, removeCategory } from '../services/api.service';
import { errorAlertOptions } from '../utils/notifications.js';


export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryList: [],
    categoriesById: {},
    categoriesByBreadcrumb: { title: 'Home', groups: [], categories: [] },
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

      const categoriesByBreadcrumb = { title: 'Home', nav: '', groups: [], categories: [] };

      // map category by breadcrumb
      categories.forEach( ( category ) => {
        let categoryGroup = categoriesByBreadcrumb;
        for ( let idx = 0; idx < category.breadcrumb.length; idx++ ) {
          const crumb = category.breadcrumb[idx];
          let group = categoryGroup.groups.find( ( g ) => g.title === crumb );
          if ( !group ) {
            group = { nav: category.breadcrumb.slice( 0, idx + 1 ).join( ',' ), title: crumb, groups: [], categories: [] };
            categoryGroup.groups.push( group );
          }
          categoryGroup = group;
        }
        categoryGroup.categories.push( category );
      } );

      // For Vue Reactivity.
      state.categoriesByBreadcrumb = categoriesByBreadcrumb;
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
