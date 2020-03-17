// 专门放置导航守卫
import router from '@/router'// 引入路由实例
import store from '@/store'// 引入store实例
// 前置守卫
// 每当路由发生变化时 前置守卫就会执行
router.beforeEach(function (to, from, next) {
// 需要判断请求的地址和token
// 如果失意/user为开头的都要拦截
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 需要拦截去登录页
    // 如果由于token失效，跳转到登录页，当前页面怎么办？登录成功后，跳转的还是这个页面吗？不一定了吧
    // 我们要实现你在A页面发请求结果失效了 也没有refresh_token 只能回到login你登录后，你希望回到A页面
    next({
      path: '/login',
      query: {
        // 需要传递的query参数
        // 为什么不用router.currentRoute 用to？ 因为这里要去当前的地址 路由发生变化的时候我想去to 登陆成功后还要去to
        // fullPath和Path的区别是 fullPath会带？后面的参数是一个完整的路径
        redirectUrl: to.fullPath // 告诉登录页 我没有完成的 访问你一定要帮我完成表示登录页需要跳转的地址
      }
    })
  } else {
    //   2种情形 一是以/user起始有token的 2是不是/user开头的路由
    // 直接放行
    next()
  }
})
