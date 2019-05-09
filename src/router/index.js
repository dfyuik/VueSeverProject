import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/welcome/Welcome'
import User from '@/views/user/User'
Vue.use(Router)
// Add a request interceptor

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component:Home,
      redirect:'/welcome',
      children:[
        {path:'welcome',name:'Welcome',component:Welcome},
        {path:'user',name:'User',component:User}
      ]
    },
  ]
})
