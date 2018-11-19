import steem from '@/services/steem.service'
import { API_URL } from '@/constants'
import requestAsync from 'request-promise'

export default {
  unpin,
  pin,
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

function unpin (topic) {
  const opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/topics/' + topic.id + '/pinned',
  };

  return requestAsync(opts)
}

function pin (topic) {
  console.log(topic)
  const opts = {
    method: 'PUT',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/topics/' + topic.id + '/pinned',
  };

  return requestAsync(opts)
}

function listRoles () {
  const opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/roles',
  };

  return requestAsync(opts)
}

// function deleteTopic (topic) {
//   var opts = {
//     method: 'DELETE',
//     json: true,
//     headers: { authorization: steem.token },
//     url: API_URL + '/api//topics',
//     body: topic
//   }

//   return requestAsync(opts)
// }

function listCategories () {
  return requestAsync({
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/categories'
  })
}

function addCategory (name) {
  const opts = {
    method: 'POST',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/categories/' + name,
  };

  return requestAsync(opts)
}

function removeCategory (name) {
  const opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/categories/' + name,
  };

  return requestAsync(opts)
}

function listValidTopics (category) {
  let url = API_URL + '/topics';

  if (category) url = API_URL + `${category}/topics`

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
  const url = API_URL + `/replies?author=${author}&permlink=${permlink}`;

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
    url: `${API_URL}/${category}/topics`,
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

  console.log(parent)

  const opts = {
    method: 'POST',
    url: API_URL + `/topics/${parent.steem.author}/${parent.steem.permlink}/reply`,
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
    url: API_URL + `/topics/${author}/${permlink}`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
  };

  return requestAsync(opts)
    .catch(err => {
      if (err.statusCode === 404) return null

      throw err
    })
}
