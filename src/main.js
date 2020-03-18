import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission'// 完成拦截模式
import store from './store'

import Vant from 'vant' // 引入vant
import plugin from '@/utils/plugin' // 引入插件 放在vant后因为需要用vant的内置函数
// import 'vant/lib/index.css' // vant 样式
import 'vant/lib/index.less' // 引入 vant 样式 这里改成less 因为我们想要修改变量
import '@/styles/index.less' // 引入全局的自定义样式  因为要覆盖vant的样式
import 'amfe-flexible' // 运行时 实时改变 font-size大小 根据屏幕

Vue.use(Vant) // 全局注册  实际上调用了 Vant导出的对象的方法  install方法
Vue.use(plugin)// 注册插件
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
