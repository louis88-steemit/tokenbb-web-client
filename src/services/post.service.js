import steem from '@/services/steem.service'
import api from '@/services/api.service'
import Moment from 'moment'

export default {
  listTopics,
  getTopic,
  editPost,
  deleteTopic,
  createTopic,
  createReply
}

async function listTopics (category) {
  const topics = await api.listValidTopics(category)
  return topics.data.map(postToTopic)
}

function postToTopic (post) {
  console.log(post)

  return {
    id: post.id,
    pinned: post.pinned,
    hidden: post.hidden,
    categoryId: post.category,
    author: post.author.user,
    permlink: post.steem.permlink,
    title: post.title,
    body: post.body
  }
}

async function getTopic (author, permlink) {
  // throw Error('Implement this with api call to db and redirect')
  const topic = await api.getValidTopic(author, permlink)
  return topic
}

function editPost (post, content) {
  return steem.broadcastPatch(Object.assign({}, post, { content }))
}

function deleteTopic (topic) {
  return api.deleteTopic(topic)
}

function createTopic (author, category, title, content) {
  return api.publishTopic(category, author, title, content)
}

function createReply (parent, author, content) {
  var title = `re: ${parent.title} ${Date.now()}`
  var message = {
    author,
    title,
    permlink: permlinkFrom(title),
    content
  }

  return steem.broadcastReply(parent, message)
    .then(reply => api.publishReply(parent, message).then(() => reply))
}

// -----------------------------------------------------------------------------

function permlinkFrom (text) {
  return removeSpecialChars(text.toLowerCase()).split(' ').join('-')
}

function removeSpecialChars (str) {
  return str.replace(/[^\w\s]/gi, '')
}

