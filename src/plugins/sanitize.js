import VueSanitize from 'vue-sanitize';

export default function sanitize( Vue ) {
  Vue.use( VueSanitize, {
    allowedTags: [
      'p', 'strong', 'i', 'u', 'ul', 'li', 'pre', 'code',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'img',
    ],
    allowedAttributes: {
      'a': [ 'href' ],
      'img': [ 'src' ],
    },
  } );
}
