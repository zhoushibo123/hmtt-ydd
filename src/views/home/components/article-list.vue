<template>
  <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
  <div class="scroll-wrapper">
      <!-- 文章列表 -->
      <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true
      -->
      <!-- 下拉刷新组件包裹列表组件 refresh事件监听方法下拉刷新时触发success-text更新后提示文本 -->
      <van-pull-refresh v-model="downLoading" @refresh='onRefresh' :success-text='successText'>
        <!-- v-model绑定的值就是value -->
         <van-list finished-text="没有数据了" v-model="upLoading" :finished="finished" @load="onLoad">
      <!-- 循环内容 -->
      <van-cell-group>
    <van-cell title="name" :value="'张三' + item " v-for="item in articles" :key="item"></van-cell>
      </van-cell-group>

    </van-list>
      </van-pull-refresh>

  </div>
</template>

<script>
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 表示下拉刷新状态 是否下拉刷新
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: []// 文章列表
    }
  },
  methods: {
    // onload是自动执行的 有检测高度机制
    // 上拉加载方法
    onLoad () {
      console.log('开始加载数据')
      // 如果你的数据已经加载完毕你应该把finished设置为true  表示一切结束不在请求
      // 此时强制判断总条数 如果超过50条就直接关闭
      // van-list组件第一次加载 需要让list组件出现滚动条 不然没法继续往下
      if (this.articles.length > 50) {
        this.finished = true// 关闭加载
      } else {
        const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
        // 上拉加载不是重新覆盖之前的数据
        this.articles.push(...arr)
        // 添加完数据需要手动关闭upLoading
        this.upLoading = false
      }

      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      // setTimeout(() => {
      //   this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      // }, 1000) // 等待一秒 然后关闭加载状态
    },
    onRefresh () {
      setTimeout(() => {
        // 下拉刷新方法
      // 下拉刷新 表示要读取最新的数据 而且要添加到数组的头部
        const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
        // 从头部添加
        this.articles.unshift(...arr)
        // 手动关闭正在加载状态
        this.downLoading = false
        this.successText = `更新了${arr.length}数据`
      }, 1000)
    }
  }

}
</script>

<style>

</style>
