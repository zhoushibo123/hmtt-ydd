// 负责处理频道数据
import request from '@/utils/request'
import store from '@/store'
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key
// 获取我的频道数据
// 要将此方法 改造成 本地化的频道
export function getMyChannels () {
  // 我们要对原来的方法进行改造 但是不想改变调用方式 还是Promise形式调用
  // 支持及本地化缓存 区分游客和登录用户
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const str = localStorage.getItem(key)// 通过缓存key获取缓存中用户的频道数据
    if (str) {
      // 本地缓存有数据 把本地数据释放给后面的执行结果
      // 请求体data.channels
      resolve({ channels: JSON.parse(str) })// 这里的结构 是和 请求体中的结构一致的
    } else {
      // 本地缓存没数据 就要去线上拉去数据调接口
      // 先得到这个数据 把数据放到缓存中
      request({ url: '/user/channels' }).then(result => {
        // 直接获取请求的结果
        localStorage.setItem(key, JSON.stringify(result.channels))
        // result.channels 是返回的我的频道数据
        // 这里还需要resolve我们的数据
        resolve(result)
      })
    }
  })
  // 返回一个Promise axios默认就是get类型
  // return request({
  //   url: 'user/channels'
  // })
}
/****
 * 获取全部频道
 *
 * **/

export function getAllChannels () {
  return request({
    url: 'channels'
  })
}

/****
 *  删除频道API
 * @params  id 作为删除频道的依据
 * ****/
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    // localStorage.getItem(key)
    const channels = JSON.parse(localStorage.getItem(key))// 直接把本地的数据转化为对象
    // 第一种
    // // 直接用filter删除  直接返回一个新数组 返回不等于id的内容
    // channels=channels.filter(item => !item.id === id)得到一个新数组
    // // 应该重新写入缓存
    // localStorage.setItem(key, JSON.stringify(channels))
    // 第二种
    const index = channels.findIndex(item => item.id === id)// 找到对应频道的id
    if (index > -1) {
      channels.splice(index, 1) // 删除对应的下标元素
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      // 如果执行成功了 我们应该 resolve()
      resolve() // resolve 可以传参 也可以不传参取决于 await需不需要参数
    } else {
      reject(new Error('没有找到对应的频道..'))
    }
  })
}
/*****
 * 添加频道的方法
 *
 * @params  channel  是 { id: 1, name: 'c++' }
 * *****/
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    // 根据当前的token判断使用哪个key
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key)) // 转化数组 得到缓存中的数据
    channels.push(channel) // 将添加的频道数据添加到队尾
    localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
    resolve() // 执行这一步 相当于 告诉我们使用promise的方法 执行成功了
  })
}
