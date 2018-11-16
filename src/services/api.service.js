import steem from '@/services/steem.service'
import { API_URL } from '@/constants'

var requestAsync = require('request-promise')

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
    headers: { authorization: steem.connect.options.accessToken },
    url: API_URL + '/topics/' + topic.id + '/pinned'
  }

  return requestAsync(opts)
}

function pin (topic) {
  console.log(topic)
  var opts = {
    method: 'PUT',
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
    url: API_URL + '/topics/' + topic.id + '/pinned'
  }

  return requestAsync(opts)
}

function listRoles () {
  var opts = {
    method: 'GET',
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
    url: API_URL + '/roles'
  }

  return requestAsync(opts)
}

// function deleteTopic (topic) {
//   var opts = {
//     method: 'DELETE',
//     json: true,
//     headers: { authorization: steem.connect.options.accessToken },
//     url: API_URL + '/api//topics',
//     body: topic
//   }

//   return requestAsync(opts)
// }

function listCategories () {
  var opts = {
    method: 'GET',
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
    url: API_URL + '/categories'
  }

  return requestAsync(opts)
}

function addCategory (name) {
  var opts = {
    method: 'POST',
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
    url: API_URL + '/categories/' + name
  }

  return requestAsync(opts)
}

function removeCategory (name) {
  var opts = {
    method: 'DELETE',
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
    url: API_URL + '/categories/' + name
  }

  return requestAsync(opts)
}

function listValidTopics (category) {
  var url = API_URL + '/topics'

  if (category) url = url + `?category=${category}`

  var opts = {
    method: 'GET',
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
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
    headers: { authorization: steem.connect.options.accessToken },
    url
  }

  return requestAsync(opts)
}

function publishTopic (message) {
  var { author, permlink, metadata } = message

  var opts = {
    method: 'POST',
    url: API_URL + `/topics`,
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
    body: {
      author,
      permlink,
      category: metadata.tokenbb.category
    }
  }

  return requestAsync(opts)
}

function publishReply (parent, message) {
  var { author, permlink } = message

  var opts = {
    method: 'POST',
    url: API_URL + `/replies`,
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
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
    headers: { authorization: steem.connect.options.accessToken }
  }

  return requestAsync(opts)
    .catch(err => {
      if (err.statusCode === 404) return null

      throw err
    })
}
