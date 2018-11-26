import Vue from 'vue';
import Buefy from 'buefy';
import moment from 'moment';

import App from './App.vue';
import router from './router';
import store from './store/index.js';

import VueNotifications from 'vue-notifications';
import miniToastr from 'mini-toastr';

import sanitize from './plugins/sanitize.js';
import { registerSW } from './registerServiceWorker';

registerSW();

const contextMap = {
  default: { theme: 'theme-default', forum: 'support', icon: 'favicon.ico' },
  monsters: { theme: 'theme-monsters', forum: 'monsters', icon: 'favicon_teeth.png' },
  localhost: { theme: 'theme-monsters', forum: 'monsters', icon: 'favicon_teeth.png' },
};
let context = contextMap.default;
const subs = ( new URL( window.location ) ).hostname.split( '.' );
if ( contextMap.hasOwnProperty( subs[0] ) ) {
  context = contextMap[subs[0]];
} else if ( subs.length >= 2 ) {
  if ( subs[1] === 'tokenbb' ) {
    context.forum = subs[0];
  }
}
console.log( `Loading TokenBB on ${context.forum} with ${context.theme}` );
document.documentElement.className = `${context.theme}`;
global.forumname = context.forum;

const link = document.querySelector( "link[rel*='icon']" ) || document.createElement( 'link' );
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = `${process.env.VUE_APP_BASE_URL}/${context.icon}`;
document.getElementsByTagName( 'head' )[0].appendChild( link );


Vue.config.productionTip = false;

Vue.use( Buefy );
Vue.use( sanitize );

const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn',
};
miniToastr.init( { types: toastTypes } );

function toast( { title, message, type, timeout, cb } ) {
  return miniToastr[type]( message, title, timeout, cb );
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast,
};

Vue.use( VueNotifications, options );

Vue.filter( 'formatDate', ( value ) => {
  if ( value ) {
    return moment.utc( String( value ) ).format( 'MMM Do YYYY' );
  }
} );

Vue.filter( 'fromNow', ( value ) => {
  if ( value ) {
    return moment.utc( String( value ) ).fromNow();
  }
} );

global.router = router;

new Vue( {
  router,
  store,
  render: ( h ) => h( App ),
} ).$mount( '#app' );
