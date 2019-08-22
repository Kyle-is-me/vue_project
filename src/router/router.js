// 这里封装一个路由
import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/view/login.vue'
import Home from '@/view/home.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    }
  ]
})
