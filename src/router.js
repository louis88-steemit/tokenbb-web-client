import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';
import NewForum from './views/NewForum.vue';
import NewTopic from './views/NewTopic.vue';
import Topic from './views/Topic.vue';
import NotFound from './views/NotFound.vue';

Vue.use( Router );

const router = new Router( {
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/create-forum',
      name: 'create-forum',
      component: NewForum,
    },
    {
      path: '/new',
      name: 'new-topic',
      component: NewTopic,
    },
    {
      path: '/topics/:author/:permlink',
      name: 'topic',
      component: Topic,
    },
    {
      path: '/404',
      name: 'not-found',
      component: NotFound,
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
} );

export default router;
