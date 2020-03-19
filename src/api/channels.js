// 负责处理频道数据
import request from '@/utils/request'

// 获取我的频道数据
export function getMyChannels () {
// 返回一个Promise axios默认就是get类型
  return request({
    url: 'user/channels'
  })
}
