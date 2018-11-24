import steem from '@/services/steem.service'
import requestAsync from 'request-promise'

export default {
  unpin,
  pin,
  hide,
  listRoles,
  // deleteTopic,
  listCategories,
  addCategory,
  removeCategory,
  listValidTopics,
  listValidReplies,
  publishTopic,
  publishReply,
  getValidTopic
}

function apiURL() {
  return `${process.env.VUE_APP_API_HOST}/v1/forum/${global.forumname}`
}

function unpin (topic) {
  const opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + `/topics/${topic.steem.author}/${topic.steem.permlink}/pin`,
  };

  return requestAsync(opts)
}

function pin (topic) {
  const opts = {
    method: 'PUT',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + `/topics/${topic.steem.author}/${topic.steem.permlink}/pin`,
  };

  return requestAsync(opts)
}

function hide (topic) {
  const opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + `/topics/${topic.steem.author}/${topic.steem.permlink}/hide`,
  };

  return requestAsync(opts)
}

function listRoles () {
  const opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + '/',
  };

  return requestAsync(opts)
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

function listCategories () {
  return requestAsync({
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + '/categories'
  })
}

function addCategory (name, title, description) {
  const opts = {
    method: 'POST',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + '/categories/',
    body: {
      name,
      title,
      description
    }
  };

  return requestAsync(opts)
}

function removeCategory (name) {
  const opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: apiURL() + '/categories/' + name,
  };

  return requestAsync(opts)
}

function listValidTopics (category) {
  let url = apiURL() + '/topics';

  if (category) url = apiURL() + `${category}/topics`

  const opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url,
  };

  return requestAsync(opts)
}

function listValidReplies (post) {
  var { author, permlink } = post
  const url = apiURL() + `/replies?author=${author}&permlink=${permlink}`;

  const opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url,
  };

  return requestAsync(opts)
}

function publishTopic (category, author, title, body) {
  return requestAsync({
    method: 'POST',
    url: `${apiURL()}/${category}/topics`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    body: {
      author,
      title,
      body
    }
  })
}

function publishReply (parent, message) {
  var { author, permlink, content } = message

  const opts = {
    method: 'POST',
    url: apiURL() + `/topics/${parent.steem.author}/${parent.steem.permlink}/reply`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    body: {
      author,
      title: permlink,
      body: content
    },
  };

  return requestAsync(opts)
}

function getValidTopic (author, permlink) {
  const opts = {
    method: 'GET',
    url: apiURL() + `/topics/${author}/${permlink}`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
  };

  return requestAsync(opts)
    .catch(err => {
      if (err.statusCode === 404) return null

      throw err
    })
}
