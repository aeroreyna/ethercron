import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    {
      path: '/history',
      name: 'History',
      component: require('@/components/history')
    },
    {
      path: '*',
      redirect: '/'
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    console.log(to, from, savedPosition);
    return { x: 0, y: 0 }
  }

})
