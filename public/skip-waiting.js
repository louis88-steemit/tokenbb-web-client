// See https://github.com/GoogleChrome/workbox/issues/1120
self.addEventListener( 'message', ( { data } ) => {
  if ( data === 'skipWaiting' ) {
    self.skipWaiting();
  }
} );
