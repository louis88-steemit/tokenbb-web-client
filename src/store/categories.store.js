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

      const categoryOrdering = this.getters['forum/getCategoryOrdering'];

      function stringToSlug( inputStr ) {
        let str = String( inputStr );
        str = str.trim();
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
        const to = 'aaaaaaeeeeiiiioooouuuunc------';

        for ( let i = 0, l = from.length; i < l; i++ ) {
          str = str.replace( new RegExp( from.charAt( i ), 'g' ), to.charAt( i ) );
        }

        return str
          .replace( /[^a-z0-9 -]/g, '' ) // remove invalid chars
          .replace( /\s+/g, '-' ) // collapse whitespace and replace by -
          .replace( /-+/g, '-' ) // collapse dashes
          .replace( /^-+/, '' ) // trim - from start of text
          .replace( /-+$/, '' ) // trim - from end of text
          .substring( 0, 24 );
      }

      function parseCategoryOrderingLevel( level, restCategories ) {
        if ( !( level instanceof Array ) ) {
          return [ [], restCategories ];
        }
        let categoriesLeft = restCategories;
        const currentLevels = [];
        for ( const index in level ) {
          const current = level[index];
          current.slug = stringToSlug( current.slug );
          current.name = current.name || 'Empty Name';
          const [ newCurrent, newCategories ] = parseCategoryOrderingLevel( current.groups, categoriesLeft );
          categoriesLeft = newCategories;
          const thislevel = [];
          for ( const categoryIndex in current.categories ) {
            const category = current.categories[categoryIndex];
            const cat = categoriesLeft.find( ( c ) => c.slug === category.slug );
            categoriesLeft = categoriesLeft.filter( ( c ) => c.slug !== category.slug );
            if ( cat ) {
              thislevel.push( cat );
            }
          }
          if ( newCurrent.length > 0 || thislevel.length > 0 ) {
            currentLevels.push( {
              name: current.name,
              slug: current.slug,
              groups: newCurrent,
              categories: thislevel,
            } );
          }
        }
        return [ currentLevels, categoriesLeft ];
      }
      const [ catparsed, restcats ] = parseCategoryOrderingLevel( categoryOrdering, categories );
      if ( restcats.length > 0 ) {
        catparsed.push( {
          name: 'Uncategorized',
          slug: 'uncategorized',
          groups: [],
          categories: restcats,
        } );
      }
      console.log( catparsed );

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
