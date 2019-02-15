import Buefy from 'buefy';
import miniToastr from 'mini-toastr';
import moment from 'moment';

import steemEditor from 'steem-editor';
import 'steem-editor/dist/css/index.css';
import Vue from 'vue';

import VueNotifications from 'vue-notifications';
import VueAnalytics from 'vue-analytics';

import App from './App.vue';

import sanitize from './plugins/sanitize.js';
import { registerSW } from './registerServiceWorker';
import router from './router';
import store from './store/index.js';

registerSW();

const contextMap = {
  default: { theme: 'theme-default', forum: 'support', icon: 'favicon.ico' },
  monsters: { theme: 'theme-monsters', forum: 'monsters', icon: 'favicon_teeth.png' },
  localhost: { theme: 'theme-silver', forum: 'monsters', icon: 'favicon_teeth.png' },
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
console.log( `Loading TokenBB on ${ context.forum } with ${ context.theme }` );
document.documentElement.className = `${ context.theme }`;
global.forumname = context.forum;
document.title = `TokenBB ${global.forumname}`;

const link = document.querySelector( 'link[rel*=\'icon\']' ) || document.createElement( 'link' );
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = `${ process.env.VUE_APP_BASE_URL }/${ context.icon }`;
document.getElementsByTagName( 'head' )[0].appendChild( link );


Vue.config.productionTip = false;

Vue.use( Buefy );
Vue.use( sanitize );

Vue.use( VueAnalytics, {
  id: process.env.VUE_APP_GA_ID,
  router,
  autoTracking: {
    exception: true,
    exceptionLogs: true,
  },
  batch: {
    enabled: true,
    amount: 5,
    delay: 500,
  },
} );

window.setGAUserID = setGAUserID;
function setGAUserID( userID ) {
  Vue.$ga.set( 'userId', userID );
}

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

Vue.use( steemEditor );

Vue.filter( 'formatDate', ( value ) => {
  if ( value ) {
    return moment.utc( String( value ) )
      .format( 'MMM Do YYYY' );
  }
} );

const locale = window.navigator.userLanguage || window.navigator.language || 'en';
console.log( `Setting TimeZone Language to ${locale}` );
moment.locale( locale );

Vue.filter( 'fromNow', ( value ) => {
  if ( value ) {
    return moment.utc( String( value ) )
      .calendar();
  }
} );

Vue.filter( 'usernameDisplay', ( username, owner ) => {
  if ( username === process.env.VUE_APP_ANON_USER ) {
    return `GuestUser#${owner.substring( 4, 10 )}`;
  }
  return username;
} );

new Vue( {
  router,
  store,
  render: ( h ) => h( App ),
} ).$mount( '#app' );
