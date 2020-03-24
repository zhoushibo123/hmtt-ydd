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

// 举报文章接口
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'// 类型
  })
}

/*****
 * 获取联想搜索建议
 * ***/
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params// query参数放置在 params中
  })
}

/****
 * 搜索文章方法
 *
 * ***/
export function searchArticle (params) {
  return request({
    url: '/search',
    params // 关键词 及分页信息
  })
}

/****
 * 获取文章详情
 *
 * ***/
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`//        /articles/:article_id
  })
}

// 获取评论和评论回复
export function getComments (params) {
  return require({
    url: '/comments',
    params// type(是文章的的回复还是回复的回复)  source(来源id)  offset(偏移量 分页依据) 查第二页的数据 传第一页的最后一个id 查第三页的数据  传第二页最后一个id ....
  })
}
