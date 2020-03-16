// store下的index.js专门用来处理vuex中的模块
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'// 引入默认对象 和 平常对象// 相当于 把默认对象和平常对象合成了一个对象  默认对象属于该对象中的default属性
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 专门用来放置共享状态
    user: auth.getUser() // 用来放置token 和refresh_token  做持久化 如果缓存中有 读取缓存中的的数据

  },
  mutations: {
    // 要修改state里的token只能通过mtations
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷中的user给state中的user
      // 更新了vuex中的数据 也应该把最新的user存入本地 调用setItem方法
      auth.setUser(payload.user) // 相当于保持vuex和本地存储同步
    },
    // 删除token
    delUser (state) {
      // 删除token 用不到payload 所以可以不写
      state.user = {}// 将vuex中token设置为空对象 因为在auth.js 中getUser的时候如果token为空也赋值给他一个空对象
      // 缓存的数据也要更新
      auth.delUser()// 调用auth中的delUser方法 删除本地token
    }
  },
  actions: {
  },
  modules: {
  }
})
