import steem from '@/services/steem.service';
import { getValidTopic, listValidTopics, publishReply, publishTopic } from './api.service.js';


export async function listTopics( category ) {
  const topics = await listValidTopics( category );
  return topics.data.map( postToTopic );
}

export function postToTopic( post ) {
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
    lastReply: post.meta.last_reply,
  };
}

export async function getTopic( author, permlink ) {

  // throw Error('Implement this with api call to db and redirect')
  const topic = await getValidTopic( author, permlink );
  return postToTopic( topic.data );
}

export function editPost( post, content ) {
  return steem.broadcastPatch( Object.assign( {}, post, { content } ) );
}

export function createTopic( author, category, title, content ) {
  return publishTopic( category, author, title, content );
}

export function createReply( parentComment, author, content ) {
  const message = {
    author,
    content,
  };

  return publishReply( parentComment, message ).then( ( result ) => result.data );
}

