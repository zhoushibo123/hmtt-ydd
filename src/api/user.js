// // 专门处理用户相关的请求

// import request from '@/utils/request' // 引入请求模块
// // request相当于axios的一个实例 和axios有同样的方法和属性
// export function login (data) {
//   return request({
//     // 配置选项
//     url: 'authorizations',
//     method: 'post',
//     data// es6  axios   body参数在data中
//   })
// //   返回一个Promise对象
// }
/******
 * 专门处理用户相关的请求
 *
 * ****/
import request from '@/utils/request' // 引入请求模块
// request相当于  axios的一个实例 和axios 有同样的方法和属性
/***
 * 登录方法
 * ***/
export function login (data) {
  return request({
    //   配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    data // 接收传入的data
    // axios 中body参数放置在data中
  })
  // 返回一个promise对象
}

// 关注用户
export function followUser (data) {
  return request({
    url: '/user/followings', // 关注用户
    method: 'post',
    data
  })
}

// 取消关注
export function unFollowUser (target) {
  return request({
    method: 'delete',
    url: `/user/followings/${target}`/// user/followings/:target
  })
}

/***
 * 获取用户自己的个人信息
 * ***/

export function getUserInfo () {
  return request({
    url: '/user'
  })
}
/****
 * 获取用户的个人资料
 *
 * ***/
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
