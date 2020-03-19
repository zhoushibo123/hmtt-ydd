<template>
      <van-pull-refresh v-model="downLoading" @refresh='onRefresh' :success-text='successText'>
        <!--refresh是监听下拉刷新的事件 success-text是提示信息 -->
        <!-- v-model绑定的值就是value -->
         <van-list finished-text="没有数据了" v-model="upLoading" :finished="finished" @load="onLoad">
      <!-- 循环内容 -->
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item">
            <!-- 放置元素 文章列表的循环项  无图  单图  三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">沉舟侧畔千帆过，病树前头万木春</h3>
              <!-- 三图图片 -->
              <div class="img_box">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->

                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <!-- <div class="img_box">
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div> -->
              <!-- 作者信息 -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
    </van-list>
      </van-pull-refresh>

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

<style lang='less' scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
