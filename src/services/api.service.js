import steem from '@/services/steem.service';
import requestAsync from 'request-promise';

export function apiURL() {
  return `${process.env.VUE_APP_API_HOST}/v1/forum/${global.forumname}`;
}

export function unpin( topic ) {
  const opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + `/topics/${topic.steem.author}/${topic.steem.permlink}/pin`,
  };

  return requestAsync( opts );
}

export function pin( topic ) {
  const opts = {
    method: 'PUT',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + `/topics/${topic.steem.author}/${topic.steem.permlink}/pin`,
  };

  return requestAsync( opts );
}

export function hide( topic ) {
  const opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + `/topics/${topic.steem.author}/${topic.steem.permlink}/hide`,
  };

  return requestAsync( opts );
}

export function vote( author, permlink, voter, weight ) {
  const opts = {
    method: 'POST',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + `/topics/${author}/${permlink}/vote`,
    body: {
      voter,
      weight,
    },
  };

  return requestAsync( opts );
}

export function listRoles() {
  const opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + '/',
  };

  return requestAsync( opts );
}

// function deleteTopic (topic) {
//   var opts = {
//     method: 'DELETE',
//     json: true,
//     headers: { authorization: steem.token },
//     url: apiURL() + '/api//topics',
//     body: topic
//   }

//   return requestAsync(opts)
// }

export function listCategories() {
  return requestAsync( {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + '/categories',
  } );
}

export function createForum( name ) {
  const opts = {
    method: 'POST',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: `${process.env.VUE_APP_API_HOST}/v1/forum/`,
    body: {
      name,
    },
  };

  return requestAsync( opts );
}

export function addCategory( name, title, description ) {
  const opts = {
    method: 'POST',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + '/categories/',
    body: {
      name,
      title,
      description,
    },
  };

  return requestAsync( opts );
}

export function removeCategory( name ) {
  const opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + '/categories/' + name,
  };

  return requestAsync( opts );
}

export function listValidTopics( category ) {
  let url = apiURL() + '/topics';

  if ( category ) {
    url = apiURL() + `${category}/topics`;
  }

  const opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url,
  };

  return requestAsync( opts );
}

export function listValidReplies( post ) {
  const { author, permlink } = post;
  const url = apiURL() + `/replies?author=${author}&permlink=${permlink}`;

  const opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url,
  };

  return requestAsync( opts );
}

export function publishTopic( category, author, title, body ) {
  return requestAsync( {
    method: 'POST',
    url: `${apiURL()}/${category}/topics`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    body: {
      author,
      title,
      body,
    },
  } );
}

export function publishReply( parent, message ) {
  const { author, permlink, content } = message;

  const opts = {
    method: 'POST',
    url: apiURL() + `/topics/${parent.steem.author}/${parent.steem.permlink}/reply`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    body: {
      author,
      title: permlink,
      body: content,
    },
  };

  return requestAsync( opts );
}

export function getValidTopic( author, permlink ) {
  const opts = {
    method: 'GET',
    url: apiURL() + `/topics/${author}/${permlink}`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
  };

  return requestAsync( opts )
    .catch( ( err ) => {
      if ( err.statusCode === 404 ) {
        return null;
      }

      throw err;
    } );
}
