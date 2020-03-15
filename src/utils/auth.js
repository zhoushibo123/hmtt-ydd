// 我们专门封装一个工具 用来处理我们的读写我们的token
//  auth.js 专门处理 token的读写和删除
// const USER_TOKEN = 'heima-toutiao-mobile-94' // 专门用来存储用户信息

const USER_TOKEN = 'heima-toutiao-mobile-94'
// 设置用户的token信息
export function setUser (user) {
  // user是一个对象
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
  // 对象需要转化成字符串
}
// 获取用户token信息
export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
  // 短路表达式
  // 如果前面为true  后面不执行 如果前面为false 后面才执行
}

// 删除用户token信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
