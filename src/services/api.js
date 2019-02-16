// import something here
import axios from 'axios'

var api = {}
Object.defineProperty(api, 'forum_name', {
  get () { return process.env.FORUM_NAME }
})

api.instance = axios.create({
  baseURL: `${process.env.VUE_APP_API_HOST}/v1/forum`
})

api.unpin = async (topic) => {
  var response = await api.instance.delete(`/${api.forum_name}/topics/${topic.steem.author}/${topic.steem.permlink}/pin`)
  return response
}

api.pin = async (topic) => {
  var response = await api.instance.put(`/${api.forum_name}/topics/${topic.steem.author}/${topic.steem.permlink}/pin`)
  return response
}

api.hide = async (topic) => {
  var response = await api.instance.delete(`/${api.forum_name}/topics/${topic.steem.author}/${topic.steem.permlink}/hide`)
  return response
}

api.vote = async (author, permlink, voter, weight) => {
  var response = await api.instance.post(`/${api.forum_name}/topics/${author}/${permlink}/vote`, { voter, weight })
  return response
}

api.listRoles = async () => {
  var response = await api.instance.get(`/${api.forum_name}/`)
  return response
}

api.listCategories = async () => {
  var response = await api.instance.get(`/${api.forum_name}/categories`)
  return response
}

api.createForum = async (forumName) => {
  var response = await api.instance.post(`/`, { name: forumName })
  return response
}

api.addCategory = async (categoryName, title, description) => {
  var response = await api.instance.post(`/${api.forum_name}/categories/`, { name: categoryName, title, description })
  return response
}

api.removeCategory = async (categoryName) => {
  var response = await api.instance.delete(`/${api.forum_name}/categories/${categoryName}`)
  return response
}

api.listValidTopics = async (category) => {
  var url = category ? `/${api.forum_name}/${category}/topics` : `/${process.env.FORUM_NAME}/topics`
  var response = await api.instance.get(url)
  return response
}

api.listValidReplies = async (post) => {
  var response = await api.instance.get(`/${api.forum_name}/replies`, post)
  return response
}

api.publishTopic = async (category, author, title, body) => {
  var response = await api.instance.post(`/${api.forum_name}/${category}/topics`, { author, title, body })
  return response
}

api.publishReply = async (parentComment, message) => {
  var data = { author: message.author, body: message.content }
  var response = await api.instance.post(`/topics/${parentComment.steem.author}/${parentComment.steem.permlink}/reply`, data)
  return response
}

api.getValidTopic = async (author, permlink) => {
  try {
    var response = await api.instance.get(`/${api.forum_name}/topics/${author}/${permlink}`)
    return response
  } catch (err) {
    if (err.response.status !== 404) {
      this.$ga.exception(err.response)
      throw err
    }
    return null
  }
}

export default api
