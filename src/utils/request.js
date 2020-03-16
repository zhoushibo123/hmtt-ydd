// 请求管理工具

// 说明
// - axios.defaults 是对本身axios 进行改造
// -axios.create 是创建了一个axios实例 ,和原来的axios没有关系了

import axios from 'axios' // 引入axios
import JSONBig from 'json-bigint'// 引入大数字处理包
import store from '../store'// 引入vuex中的实例对象store  相当于组件中的this.$store
import router from '@/router'// 引入router对象
const instance = axios.create({
// 构造参数传入一些配置 和defaults一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/', // 基础的请求地址
  //   此函数是后台响应回来但是还没有进入到axios的响应拦截器时执行 数组里可以放多个处理函数
  transformResponse: [function (data) {
    // data是后端响应会来的字符串
    // JSON.parse（）默认
    return data ? JSONBig.parse(data) : {} // 大数字第三方包处理data
  }]
}) // 创建一个实例

// 在请求拦截器里注册统一的token
//  instance是一个新的axios实例
instance.interceptors.request.use(function (config) {
// 成功的时候 如何处理
// 读取配置信息 在配置信息中存入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
    return config // 返回配置项
  }
},
function (error) {
// 直接返回错误
  return Promise.reject(error) // 返回抛出的错误 这样的话直接进入axios的catch中
})
// 在响应拦截器 处理返回结果的数据 将数据脱衣处理
instance.interceptors.response.use(function (response) {
// response实际已经被axios包了一层数据
// 几乎所有的返回数据都有一层data
  try {
    return response.data.data // 如果成功直接返回
  } catch (error) {
    // 如果失败那就脱一层
    return response.data
  }
},
function (error) {
  // 如果请求失败或者失效或者其他错误 会进入到响应拦截器的错误区域
  // 只要是401就是token失效（因为用导航守卫把没有token的拦截在外边了）
  /*
 error
     config 是出像这次请求的配置信息
     request请求对象
     response响应对象 status（状态码）
 */

  if (error.response && error.response.status === 401) {
    // 只要是401就是token失效
    // refresh_token相当于续命的药
    if (store.state.user.refresh_token) {
      // 表示你有续命药
    } else {
      // 如果没有refresh_token 直接回到登录页 获取token

      router.push({
        path: '/login',
        query: {
          // 动态路由传参？ query传参
          // 需要传递的query参数
          redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的地址
        }
      })
    }
  }
  return Promise.reject(error)
}
)
export default instance
// 导出这个实例
