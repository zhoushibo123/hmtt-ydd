import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home'
Vue.use(VueRouter)
// 用按需加载的方式配置路由
const Layout = () => import('@/views/layout') // 按需引入layout
// 引入layout下的二级路由
const home = () => import('@/views/home') // 按需引入home 二级路由
const video = () => import('@/views/video') // 按需引入video  二级路由
const user = () => import('@/views/user') // 按需引入user 二级路由
const question = () => import('@/views/question') // 按需引入问答组件二级路由
// ----------其他一级路由------------//
const chat = () => import('@/views/user/chat') // 小智同学
const login = () => import('@/views/login') // 登录组件
const profile = () => import('@/views/user/profile') // 编辑资料组件
const search = () => import('@/views/search') // 搜素组件
const result = () => import('@/views/search/result') // 搜索结果组件
const article = () => import('@/views/article') // 文章详情组件

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout, // 布局组件一级路由
    children: [{
      path: '', // path什么都不写 就是摩尔恩二级路由的默认组件
      component: home
    }, {
      path: '/question',
      component: question// 问答组件
    }, {
      path: '/video',
      component: video // 视频组件
    }, {
      path: '/user',
      component: user// 个人中心组件
    }]
  },
  { // 其他一级路由 小智同学
    path: '/user/chat',
    component: chat
  },
  { // 一级路由登录组件
    path: '/login',
    component: login
  },
  { // 一级路由 编辑资料组件
    path: '/user/profile',
    component: profile
  },
  {
    // 一级路由 搜索中心组件
    path: '/search',
    component: search
  },
  { // 一级路由 搜索结果组件
    path: '/search/result',
    component: result
  },
  { // 一级路由 文章详情
    path: 'article',
    component: article
  }
]

const router = new VueRouter({
  routes
})

export default router
