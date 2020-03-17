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
async function (error) {
  // 如果请求失败或者失效或者其他错误 会进入到响应拦截器的错误区域
  // 只要是401就是token失效（因为用导航守卫把没有token的拦截在外边了）
  /*
 error
     config 是出像这次请求的配置信息
     request请求对象
     response响应对象 status（状态码）
 */

  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login',
      query: {
        // 动态路由传参？ query传参
        // 需要传递的query参数
        redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的地址
      }

    }
    // 只要是401就是token失效
    // refresh_token相当于续命的药

    if (store.state.user.refresh_token) {
      // 表示你有续命药
      // 如果有refresh_token 就用他换取token 需要调用刷新token的接口
      // 发请求得用工具 用axios？instance？
      // 这里必须用axios 因为现在token已经失效了 instance的拦截器 还是会将失效的token注入到headers中
      // 需要用没有拦截器的的axios 来发token的请求
      try {
        const result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 完整的url地址
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }, // 在请求头中注入refresh_token
          method: 'put'
        })
        // 如果执行成功  Promise执行成功的逻辑
        // 如果成功应该更新之前失效的token
        // 直接更新vuex中的token
        store.commit('updateUser', {
          // {}就是payload user对应user一一对应关系  updateUser 方法中有本地储存的方法auth.setUser(payload.user)
          user: {
            // token
            token: result.data.data.token, // 最新的token   用refresh_token换来的
            refresh_token: store.state.user.refresh_token// 保留原来的refresh_token 留着下次用
          }
        })// 提交mutations更新vuex中state数据
        // 你之所以回到这个位置是因为401 意味着你之前的请求 是错误的
        // 需要将401处理后（拿到最新的token）在发送给后端
        return instance(error.config)// 相当于执行之前出现401时错误的请求 但这时已经是最新的token 是继续执行这个请求执行链下边的内容
      } catch (error) {
        // 如果失败 意味着你尝试续命 结果续命失败
        // 重新登陆 登陆之前要删除token和refresh_token 因为这俩都失效了
        store.commit('delUser')// 调用vuex方法 删除token
        router.push(path)// 调用封装好的path
      }
    } else {
      // 如果没有refresh_token 直接回到登录页 获取token
      /* router.push('/login')直接跳转到登录页无可厚非 但是我们需要一种更复杂的场景
      如果由于token失效，跳转到登录页，当前页面怎么办？登录成功后，跳转的还是这个页面吗？不一定了吧
      我们要实现你在A页面发请求结果失效了 也没有refresh_token 只能回到login你登录后，你希望回到A页面
      怎么做呢?我们需要在跳到登录页过程中，把当前页面的地址传给登录页面
      登录页面 登录成功后 先判断 有没有需要跳转的地址  如果没有就会跳到主页 如果有就跳到需要跳转的页面
      router.currentRoute 表示当前的路由信息对象 里面包含了路由的地址和参数
      我们需要获取 当前路由的带参数的地址 router.currentRoute.fullPath  (查看中文文档)
       */
      router.push(path)// 调用封装好的path
    }
  }
  return Promise.reject(error)
}
)
export default instance
// 导出这个实例
