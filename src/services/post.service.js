import steem from '@/services/steem.service'
import api from '@/services/api.service'

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
  return {
    id: post.id,
    pinned: post.pinned,
    hidden: post.hidden,
    categoryId: post.category,
    author: post.author,
    permlink: post.steem.permlink,
    title: post.title,
    body: post.body,
    steem: post.steem,
    replies: post.replies,
    numberOfReplies: post.meta.replies,
    numberOfViews: post.meta.views,
    lastReply: post.meta.last_reply
  }
}

async function getTopic (author, permlink) {
  // throw Error('Implement this with api call to db and redirect')
  const topic = await api.getValidTopic(author, permlink)
  return postToTopic(topic.data)
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
  var title = `re: ${parent.title}}`
  var message = {
    author,
    title,
    permlink: permlinkFrom(title),
    content
  }

  return api.publishReply(parent, message).then((result) => result.data)
}

// -----------------------------------------------------------------------------

function permlinkFrom (text) {
  return removeSpecialChars(text.toLowerCase()).split(' ').join('-')
}

function removeSpecialChars (str) {
  return str.replace(/[^\w\s]/gi, '')
}

