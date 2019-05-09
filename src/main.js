// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import '@/styles/index.scss'
Vue.use(ElementUI)
import store from '@/store/store'

Vue.config.productionTip = false

// 注册一个全局守卫  作用是在跳转前  对路由进行判断  防止未登录的用户跳转到其他页面去
// to:即将要进入的目标 路由对象
// form: 当前导航正要离开的路由
// next()  进行下一步跳转
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('mytoken')
  // 如果你已经登录， 那我不干涉你， 让你自由跳转
  if(token){
    next()
  }else{
    if(to.path!=='/login'){
      // 如果没有登录 但你访问其他需要登录的页面，那我就让你跳到登录页面
      next({path:'/login'})
    }else{
      // 如果没有登录  但你访问的是login  那就不干涉你，让你访问
      next()
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
