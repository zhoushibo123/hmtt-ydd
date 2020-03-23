<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件双向绑定 -->
    <!-- 有输入内容的时候显示联想和没有输入内容的时候显示历史记录 -->
    <!-- search api方法 回车时会触发 -->
    <van-search  @search='onSearch' v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容 -->
    <van-cell-group v-if="q" class="suggest-box" >
      <!-- 要循环的联想记录 -->
      <van-cell @click="toResult(item)" icon="search" v-for="(item,index) in suggestList " :key="index">
        {{item}}
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div v-else class="history-box">
      <!-- 只有当历史纪录存在时才显示 历史记录 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
            <!-- 清空历史记录 绑定事件 -->
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 数据变成动态的 -->
        <!-- 点击历史记录时把对应的数据拿到 -->
        <van-cell  @click="toSearchResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
           <!-- 给叉号注册点击事件 需要传对应的索引-->
           <!-- 此时事件冒泡了 要阻止冒泡 -->
           <!-- vue中可以用修饰符组织事件冒泡 -->
          <van-icon  @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles'// 搜索联想的api
// 定义一个key,用来存储历史记录到本地缓存
const key = 'hm-94-toutiao-history' // 此key用来作为 历史记录在本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      historyList: [], // 作为一个变量 接受历史记录
      suggestList: []// 联想的搜索建议
    }
  },
  methods: {
    toResult (text) {
      // 点击联想记录跳转到搜索结果
      // 先把text追加到历史记录里
      this.historyList.push(text)
      // 有可能重复
      this.historyList = Array.from(new Set(this.historyList)) // 去重
      // 设置到缓存中
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 跳转
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    delHistory (index) {
      // 删除历史记录的方法
      this.historyList = this.historyList.splice(index, 1)
      // 删除后存到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    toSearchResult (text) {
      // text 来接受item
      // 跳到历史记录的搜索结果页
      // this.$router 路由对象实例
      // this.$route 当前的路由页面对象信息  当前地址 params参数  query参数 fullPath
      // 路由传参 params query
      //   this.$router.push('/search/result?q=' + text) // 采用query传递参数  地址拼接参数
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    async clear () {
      // 直接清空历史记录
      // 一般来说 删除所有内容之前
      // 本身也支持promise
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您是否要清空历史记录'
        })
        // 成功后执行
        this.historyList = []// 将本地历史记录设置为空
        localStorage.setItem(key, '[]')// 同步设置历史记录为空
      } catch (error) {
        // 失败不需要处理
      }
    },
    onSearch () {
      // 监听输入框search方法
      // 先判断输入框不能为空  为空 直接返回
      if (!this.q) return
      // 应该在跳转之前 应该把搜索的结果 添加到历史记录
      // 这里要去重 set
      this.historyList.push(this.q)// 将搜索内容加入到历史记录
      this.historyList = Array.from(new Set(this.historyList))// 去重
      // 在缓存到本地
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 进行跳转时要携带对应的参数 到搜索结果页
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  },
  watch: {
    q () {
      // 监听data中q的变化
      // 防抖
      // 我们要在这个位置 去请求接口
    //   clearTimeout(this.timer)// 先清除定时器
    //   this.timer = setTimeout(async () => {
    //     // 需要判断当清空的时候不能发送请求 但是要把联想记忆清空
    //     if (!this.q) {
    //       // 搜索框没数据时
    //       this.suggestList = []
    //       return
    //     }
    //     // 此函数中需要 请求 联想搜索的建议
    //     // 联想搜索的建议 需要 放置在一个变量中
    //     const data = await getSuggestion({ q: this.q })
    //     this.suggestList = data.options// 将返回的词条的options父追给但前的搜索建议
    //   }, 300)
    // }
    // --------节流
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null
          // 需要判断 当清空的时候 不能发送请求 但是要把联想的建议清空
          if (!this.q) {
            // 如果这时 搜索关键字没有内容
            this.suggestList = []
            // 不能再继续了
            return
          }
          const data = await getSuggestion({ q: this.q })
          this.suggestList = data.options// 将返回的词条的options父追给但前的搜索建议
        }, 300)
      }
    }
  },
  created () {
    // 在钩子函数中读取历史数据
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
