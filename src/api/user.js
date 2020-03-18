// 专门处理用户相关的请求
import request from '@/utils/request'// 引入请求模块
// request相当于axios的一个实例 和axios有同样的方法和属性
export function login (data) {
  return request({
    // 配置选项
    url: 'authorizations',
    method: 'post',
    data// es6  axios   body参数在data中
  })
//   返回一个Promise对象
}
