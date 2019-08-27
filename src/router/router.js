// 这里封装一个路由
import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/view/login.vue'
import Home from '@/view/home.vue'
import Welcome from '@/view/welcome.vue'
import Users from '@/view/user/users.vue'
import Roles from '@/view/authority/roles.vue'
import Rights from '@/view/authority/rights.vue'
import Goods from '@/view/goods/goods.vue'
import List from '@/view/goods/list.vue'
import Add from '@/view/goods/add.vue'
import Reports from '@/view/reports/reports.vue'

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
      component: Home,
      // 添加路由重定向
      redirect: { name: 'welcome' },
      // 添加嵌套路由
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        },
        {
          name: 'rights',
          path: 'rights',
          component: Rights
        },
        {
          name: 'goods',
          path: 'goods',
          component: Goods,
          // 重定向
          redirect: { name: 'list' },
          children: [
            {
              name: 'list',
              path: 'list',
              component: List
            },
            {
              name: 'add',
              path: 'add',
              component: Add
            }
          ]
        },
        {
          name: 'reports',
          path: 'reports',
          component: Reports
        }
      ]
    }
  ]
})
