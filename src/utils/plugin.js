// 专门处理一些小函数及vue中常用的过滤器及函数
import dayjs from 'dayjs'// 引入dayjs包
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间的插件
import 'dayjs/locale/zh-cn' // dayjs 不会自动引入语言包 默认只支持英文语言包
dayjs.extend(relativeTime) // 相当于 dayjs扩展 相对时间的方法 这个方法写完之后 dayjs 就有了form方法
export default {
  // 导出一个默认对象
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 执行此行代码时 Vue.prototype.$notify 应该已经挂载完成
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({ duration: 800, ...params }) // 小伎俩
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    Vue.prototype.$sleep = sleep// 定义一个原型属性 $sleep所有的组件都有了这个属性
    // 用到之前学的过滤器 全局过滤器
    // Vue.filter(名称，函数)
    Vue.filter('relTime', relTime)// 注册一个全局过滤器 全局随意使用
  }
}

// 延迟处理函数 降低用户刷新频率
//  休眠函数
// time=500 es6默认值 传了就用传的 没传用默认的
function sleep (time = 500) {
  // 返回一个Primise
  return new Promise(function (resolve, reject) {
    // 肯定是成功 执行 但是有一个延迟
    setTimeout(() => resolve(), time)
  })
}
/*****
 * 此函数用来将 日期转化成 相对时间
 *@params date 传入的日期
 * *****/
function relTime (date) {
  // 还需要对dayjs 进行本地的语言包转化
  return dayjs().locale('zh-cn').from(date) // from(中的值是 日期 或者dayjs得到的日期)  dayjs() 当前时间  dayjs().from(date) 当前时间距离传入时间有多远
}
