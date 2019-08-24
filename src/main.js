import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import '@/styles/index.less'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // to目标路由，里面的一个属性path就是目标路由的path值
  // console.log(to)
  // 获取token
  let mytoken = localStorage.getItem('itcast_manage_35')
  // console.log(mytoken)
  // 判断
  if (mytoken || to.path === '/login') {
    // 下一步
    next()
  } else {
    // 重定向
    next({ path: '/login' })
  }
})

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
