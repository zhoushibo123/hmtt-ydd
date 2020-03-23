<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件双向绑定 -->
    <!-- 有输入内容的时候显示联想和没有输入内容的时候显示历史记录 -->
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容 -->
    <van-cell-group v-if="q" class="suggest-box" >
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div v-else class="history-box">
      <!-- 只有当历史纪录存在时才显示 历史记录 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>

        <van-icon name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 数据变成动态的 -->
        <van-cell v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
           <!-- 给叉号注册点击事件 需要传对应的索引-->
          <van-icon  @click="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 定义一个key,用来存储历史记录到本地缓存
const key = 'hm-94-toutiao-history' // 此key用来作为 历史记录在本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      historyList: []// 作为一个变量 接受历史记录
    }
  },
  methods: {

    delHistory (index) {
      // 删除历史记录的方法
      this.historyList = this.historyList.splice(index, 1)
      // 删除后存到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
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
