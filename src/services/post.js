import api from './api'

var post = {}
post.postToTopic = (post) => {
  return {
    id: post.id,
    pinned: post.pinned,
    hidden: post.hidden,
    createdAt: post.createdAt,
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

post.listTopics = async (category) => {
  const topics = await api.listValidTopics(category)
  return topics.data.map(post.postToTopic)
}

post.getTopic = async (author, permlink) => {
  const topic = await api.getValidTopic(author, permlink)
  if (topic === null) {
    return null
  }
  return api.postToTopic(topic.data)
}

post.createTopic = async (category, author, title, content) => {
  var response = await api.publishTopic(category, author, title, content)
  return response.data
}

post.createTopic = async (parentComment, author, content) => {
  var response = await api.publishReply(parentComment, { author, content })
  return response.data
}

export default post
