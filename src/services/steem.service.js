import steem from '@steemit/steem-js'

class SteemService {
  constructor() {
    this.token = null;
  }

  getContent(author, permlink) {
    return new Promise( ( ( resolve, reject ) => {
      steem.api.getContent( author, permlink, ( err, result ) => {
        if ( err ) {
          return reject( err );
        }
        resolve( result );
      } );
    } ) );
  }

  getTopic( author, permlink ) {
    const app = process.env.VUE_APP_STACK_NAME;
    const path = `/tokenbb-${app}-topics/@${author}/${permlink}`;

    return steem.api.callAsync( 'get_state', [ path ] )
      .then( ( res ) => {
        const topic = res.content[`${author}/${permlink}`];

        topic.metadata = JSON.parse( topic.json_metadata );
        topic.replies = topic.replies.map( ( permlink ) => res.content[permlink] );

        return topic;
      } );
  }

  broadcastPatch( post ) {
    const args = [
      post.parent_author,
      post.parent_permlink,
      post.author,
      post.permlink,
      post.title,
      post.content,
      post.metadata,
    ];

    return this._broadcast( args );
  }

  vote( author, permlink, weight = 0.01 ) {

    // weight 1 to 10000 (100%)

    weight *= 100;

    return new Promise( async ( resolve, reject ) => {
      const { account } = await this.me();
      const { name } = account;

      this.connect.vote( name, author, permlink, weight, ( err, res ) => {
        if ( err ) {
          return reject( err );
        }

        return resolve( res );
      } );
    } );
  }

  me() {
    return new Promise( ( resolve, reject ) => {
      this.connect.me( ( err, res ) => {
        if ( err ) {
          return reject( err );
        }

        return resolve( res );
      } );
    } );
  }
  _broadcast( args ) {
    const broadcastFn = promisify( this.connect.comment ).bind( this.connect );

    return broadcastFn( ...args ).then( () => {
      const author = args[2];
      const permlink = args[3];

      return this.getTopic( author, permlink );
    } );
  }


}

export default new SteemService();
