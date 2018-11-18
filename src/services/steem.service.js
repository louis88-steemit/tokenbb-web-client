import api from '@/services/api.service'

class SteemService {
  constructor () {
    this.token = null
  }

  getTopic (author, permlink) {
    const app = process.env.VUE_APP_STACK_NAME
    var path = `/tokenbb-${app}-topics/@${author}/${permlink}`

    return steem.api.callAsync('get_state', [ path ])
      .then(res => {
        var topic = res.content[`${author}/${permlink}`]

        topic.metadata = JSON.parse(topic.json_metadata)
        topic.replies = topic.replies.map(permlink => res.content[permlink])

        return topic
      })
  }

  listAllTopics () {
    return api.listValidTopics()
  }

  listReplies (author, permlink) {
    return getContentRepliesAsync(author, permlink)
  }

  broadcastPatch (post) {
    var args = [
      post.parent_author,
      post.parent_permlink,
      post.author,
      post.permlink,
      post.title,
      post.content,
      post.metadata
    ]

    return this._broadcast(args)
  }

  broadcastReply (parent, reply) {
    var args = [
      parent.author,
      parent.permlink,
      reply.author,
      reply.permlink,
      reply.title,
      reply.content,
      this._createPostMetadata(reply)
    ]

    return this._broadcast(args)
  }

  vote (author, permlink, weight = 0.01) {
    // weight 1 to 10000 (100%)

    weight *= 100

    return new Promise(async (resolve, reject) => {
      var { account } = await this.me()
      var { name } = account

      this.connect.vote(name, author, permlink, weight, (err, res) => {
        if (err) return reject(err)

        return resolve(res)
      })
    })
  }

  me () {
    return new Promise((resolve, reject) => {
      this.connect.me((err, res) => {
        if (err) return reject(err)

        return resolve(res)
      })
    })
  }

  _createPostMetadata (post) {
    return {
      'app': 'tokenbb/0.1',
      'format': 'markdown',
      'tags': [ 'tokenbb' ],
      'images': [],
      'videos': [],
      'tokenbb': {
        'account': this.parentPost.author,
        'category': post.category || null,
        'tags': []
      }
    }
  }

  _broadcast (args) {
    var broadcastFn = promisify(this.connect.comment).bind(this.connect)

    return broadcastFn(...args).then(() => {
      var author = args[2]
      var permlink = args[3]

      return this.getTopic(author, permlink)
    })
  }


}

export default new SteemService()
