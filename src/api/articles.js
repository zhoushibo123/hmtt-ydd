// 获取频道新闻推荐v1.1
/****
 * 获取文章推荐数据
 *  需要传入 timestamp 时间戳  channel_id (频道id)
 * ****/
import request from '@/utils/request'

export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles', // 完整地址
    params: {
      with_top: 1, ...params
    }// 合并数据3个参数  with_top: 1写死  channel_id通过父子传值
  })
}

// 不感兴趣的文章接口方法
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data// es6
  })
}
