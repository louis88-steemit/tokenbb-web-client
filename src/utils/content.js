import moment from 'moment/moment';
import 'moment/locale/en-au';

export function quoteText( quote ) {
  const user = quote.author.user;
  const textToQuote = quote.body;
  console.log( quote );
  const timeOfQuote = moment.utc( String( quote.updatedAt ) )
    .format( 'DD.MM.YYYY kk:mm:ss' ) + ' UTC';
  return `\n> User @${ user } wrote at ${ timeOfQuote }:\n${ textToQuote.replace( /^/gm, '> ' ) }\n> \n`;
}
