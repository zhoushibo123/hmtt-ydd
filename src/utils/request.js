// 请求管理工具

// 说明
// - axios.defaults 是对本身axios 进行改造
// -axios.create 是创建了一个axios实例 ,和原来的axios没有关系了

import axios from 'axios' // 引入axios
const instance = axios.create({
// 构造参数传入一些配置 和defaults一样

}) // 创建一个实例

export default instance
// 导出这个实例
