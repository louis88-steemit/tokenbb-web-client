import steem from '@steemit/steem-js'
import { promisify } from 'es6-promisify'
import networks from 'steem-networks'
import steemconnect from 'steemconnect'
import { CLIENT_URL, STACK_NAME, CONNECT_API_URL } from '@/constants'

var getContentAsync = promisify(steem.api.getContent)
var getContentRepliesAsync = (author, permlink) => steem.api.callAsync('get_content_replies', [ author, permlink ])

class SteemService {
  constructor () {
    this.stackName = STACK_NAME
    this.network = networks['main']

    this.parentPost = {
      author: 'tkbb.' + this.stackName,
      permlink: 'tokenbb-' + this.stackName + '-topics'
    }

    steem.api.setOptions({ url: this.network.rpc })
    steem.config.set('address_prefix', this.network.prefix)
    steem.config.set('chain_id', this.network.chainId)

    this.connect = this._createConnectAPI()
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
    var { author, permlink } = this.parentPost

    return getContentRepliesAsync(author, permlink)
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

  broadcastTopic (topic) {
    var operations = [
      ['comment', {
        parent_author: this.parentPost.author,
        parent_permlink: this.parentPost.permlink,
        author: topic.author,
        permlink: topic.permlink,
        title: topic.title,
        body: topic.content,
        json_metadata: JSON.stringify(this._createPostMetadata(topic))
      }],
      ['comment_options', {
        'author': topic.author,
        'permlink': topic.permlink,
        'allow_votes': true,
        'allow_curation_rewards': true,
        'max_accepted_payout': '1000000.000 SBD',
        'percent_steem_dollars': 5000, // 50%
        'extensions': [
          [0, {
            'beneficiaries': [{
              'account': 'tokenbb',
              'weight': 1000 // (10%)
            }]
          }]
        ]
      }]
    ]

    var fn = promisify(this.connect.broadcast).bind(this.connect)

    return fn(operations)
      .then(() => this.getTopic(topic.author, topic.permlink))
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

  _createConnectAPI () {
    var api = steemconnect.Initialize({
      app: 'tkbc.' + this.stackName,
      callbackURL: CLIENT_URL,
      accessToken: 'access_token',
      scope: [ 'comment', 'vote', 'comment_options' ]
    })

    api.setBaseURL(CONNECT_API_URL)

    return api
  }
}

export default new SteemService()
