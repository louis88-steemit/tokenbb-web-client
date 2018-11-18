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

function listTopics (category) {
  var promises = [
    api.listValidTopics(category),
    steem.listAllTopics()
  ]

  return Promise.all(promises).then(([ validTopicPosts, topicPosts ]) => {
    // var filtered = filterInvalidPosts(validTopicPosts, topicPosts)

    // return filtered
    return validTopicPosts.data
      .map(valid => {
        var post = topicPosts.find(post => {
          return post.author === valid.author && post.permlink === valid.permlink
        })

        return Object.assign(post, valid)
      })
      .map(postToTopic)
  })
}

function postToTopic (post) {
  var { tokenbb } = JSON.parse(post.json_metadata)

  var lastReplyOn = new Moment(post.last_reply_on || 0)
  var lastUpdateOn = new Moment(post.last_update)

  return {
    id: post.id,
    pinned: post.pinned,
    hidden: post.hidden,
    categoryId: tokenbb.category,
    author: post.author,
    permlink: post.permlink,
    title: post.title,
    created: post.created,
    pendingPayout: post.total_pending_payout_value,
    body: post.body,
    numberOfReplies: post.children,
    lastUpdate: lastReplyOn.isBefore(lastUpdateOn)
      ? lastUpdateOn
      : lastReplyOn
  }
}

async function getTopic (author, permlink) {
  throw Error('Implement this with api call to db and redirect')

  const valid = await api.getValidTopic(author, permlink)
  const replies = exposePostsMetadata(valid)
  let topic = {}
  topic.categoryId = valid.categoryId
  topic.pinned = valid.pinned
  topic.replies = replies
  topic.metadata = JSON.parse(topic.json_metadata)
  topic.id = valid.id

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

function exposePostsMetadata (posts) {
  return posts.map(post => {
    post.metadata = JSON.parse(post.json_metadata)

    return post
  })
}
