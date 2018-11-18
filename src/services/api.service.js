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
  var opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/topics/' + topic.id + '/pinned'
  }

  return requestAsync(opts)
}

function pin (topic) {
  console.log(topic)
  var opts = {
    method: 'PUT',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/topics/' + topic.id + '/pinned'
  }

  return requestAsync(opts)
}

function listRoles () {
  var opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/roles'
  }

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
  var opts = {
    method: 'POST',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/categories/' + name
  }

  return requestAsync(opts)
}

function removeCategory (name) {
  var opts = {
    method: 'DELETE',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url: API_URL + '/categories/' + name
  }

  return requestAsync(opts)
}

function listValidTopics (category) {
  var url = API_URL + '/topics'

  if (category) url = API_URL + `${category}/topics`

  var opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url
  }

  return requestAsync(opts)
}

function listValidReplies (post) {
  var { author, permlink } = post
  var url = API_URL + `/replies?author=${author}&permlink=${permlink}`

  var opts = {
    method: 'GET',
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    url
  }

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
  var { author, permlink } = message

  var opts = {
    method: 'POST',
    url: API_URL + `/replies`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
    body: {
      parent,
      author,
      permlink
    }
  }

  return requestAsync(opts)
}

function getValidTopic (author, permlink) {
  var opts = {
    method: 'GET',
    url: API_URL + `/topics/${author}/${permlink}`,
    json: true,
    headers: steem.token ? { 'Authorization': 'Bearer ' + steem.token } : {},
  }

  return requestAsync(opts)
    .catch(err => {
      if (err.statusCode === 404) return null

      throw err
    })
}
