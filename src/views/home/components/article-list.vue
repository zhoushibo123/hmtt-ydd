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
    <!-- 下拉刷新组件包裹 列表组件 -->
      <van-pull-refresh v-model="downLoading" @refresh='onRefresh' :success-text='successText'>
        <!--refresh是监听下拉刷新的事件 success-text是提示信息 -->
        <!-- v-model绑定的值就是value -->
         <van-list finished-text="没有数据了" v-model="upLoading" :finished="finished" @load="onLoad">
      <!-- 循环内容 -->
        <van-cell-group>
          <!--item.art_id此时是一个大数字对象  -->
          <!-- 给van-cell加一个to属性 就可以跳转到对应的页面 -->
          <van-cell :to='`/article?artId=${item.art_id.toString()}`' v-for="item in articles" :key="item.art_id.toString()">
            <!-- 放置元素 文章列表的循环项  无图  单图  三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 此时根据封面类型判断三图还是单图还是无图 -->
              <!-- 三图图片 -->
              <div class="img_box" v-if="item.cover.type===3">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                  <!-- 图片懒加载 -->
                    <!-- lazy-load表示 该图片组件 会进行 懒加载 也就是只有当前屏幕出现的之后 才去加载对应的图片 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load  class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load  class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load  class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <!-- 使用过滤器 -->
                <!-- <span>{{item.pubdate}}</span> -->
                <span>{{item.pubdate | relTime}}</span>
                <!-- 此叉号需要通过是否有token来决定显示还是隐藏 -->
                <!-- 原始方式 -->
                <!-- <span class="close" v-if="$store.state.user.token"> -->
                  <!-- 辅助函数形式 -->
                  <!-- 点击叉号显示弹层 在子组件article-list中点击叉号 在父组件index中的弹层显示 -->
                  <!-- 阻止冒泡 -->
                  <span @click.stop="$emit('ShowArticle',item.art_id.toString())" class="close" v-if="user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
    </van-list>
      </van-pull-refresh>
</div>
</template>

<script>
// 引入获取文章模块
import { getArticles } from '@/api/articles'
import { mapState } from 'vuex'// 引入辅助函数
import eventBus from '@/utils/eventbus'
export default {
  // 初始化函数
  created () {
    // 监听触发的delArticle事件
    // 相当于有多少实例就监听多少次
    // delArticle=>假如有四个实例 就执行四次
    // artId, channelId 对应传递的this.articleId, this.channels[this.activeIndex].id
    // 一个是不喜欢文章的id 另一个是这篇文祥在对应频道的id
    eventBus.$on('delArticle', (artId, channelId) => {
      // 这个位置 每个组件实例都会触发
      // 判断一下 传过来的频道id是否和自己props传过来的id相等
      if (channelId === this.channel_id) {
        // 说明就是我们要操作的article-list实例 就可以删除
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        // 通过id查询到对应文章的索引
        if (index > -1) {
          // 因为下标从0开始 所以要大于-1
          this.articles.splice(index, 1)// 删除对应下标的数据
        }
        // 但是 如果你一直删除 就会将 列表数据都删光 并不会触发 load事件
        if (this.articles.length === 0) {
          //  说明你把数据给删光了
          this.onLoad() // 手动的触发onload事件 给页面加数据
        }
      }
    })
  },
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 表示下拉刷新状态 是否下拉刷新
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: [], // 文章列表
      timestamp: null// 定义一个 timestamp属性,用来存放时间戳
    }
  },
  computed: {
    ...mapState(['user'])// 将vuex中的 user对象映射到计算属性中
  },
  props: {
    // props 对象形式 可以约束传入的值 必填 传值类型
    // key(props属性名): value(对象 配置)
    channel_id: {
      required: true, // 必填项 此属性的含义 true 要求该props必传
      type: Number, // 表示传入的prop属性的类型
      default: null// 默认值的意思是 假如你没有传入prop属性 默认值就会被采用
    }
  },
  methods: {
    // onload是自动执行的 有检测高度机制
    // 上拉加载方法
    async onLoad () {
      console.log('开始加载列表数据')
      // 如果你的数据已经加载完毕你应该把finished设置为true  表示一切结束不在请求
      // 此时强制判断总条数 如果超过50条就直接关闭
      // van-list组件第一次加载 需要让list组件出现滚动条 不然没法继续往下
      // if (this.articles.length > 50) {
      //   this.finished = true// 关闭加载
      // } else {
      //   const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
      //   // 上拉加载不是重新覆盖之前的数据
      //   this.articles.push(...arr)
      //   // 添加完数据需要手动关闭upLoading
      //   this.upLoading = false
      // }

      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      // setTimeout(() => {
      //   this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      // }, 1000) // 等待一秒 然后关闭加载状态
      // -------------------
      //  this.channel_id当前的频道id
      await this.$sleep()// 人为控制了请求的时间
      // this.timestamp || Date.now() 如果有六十时间戳就用历史时间戳 没有就用当前的时间戳
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // 获取数据
      this.articles.push(...data.results)// 将数据追加到队尾
      this.upLoading = false// 关闭加载状态
      // 需要将历史时间戳给timestamp  但是 赋值之前有个判断  需要判断一下历史时间戳是否为0
      // 如果历史时间戳为0 说明已经没有数据了  finished =true
      if (data.pre_timestamp) {
        // r如果有历史时间戳 说明还有数据可以进行加载
        this.timestamp = data.pre_timestamp
      } else {
        // 表示没有数据了 到底了
        this.finished = true // 手动关闭
      }
    },
    // 下拉刷新方法
    async  onRefresh () {
      await this.$sleep()// 人为控制了请求的时间
      // setTimeout(() => {
      //   // 下拉刷新方法
      // // 下拉刷新 表示要读取最新的数据 而且要添加到数组的头部
      //   const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
      //   // 从头部添加
      //   this.articles.unshift(...arr)
      //   // 手动关闭正在加载状态
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}数据`
      // }, 1000)
      // -----------
      // 下来刷新应该是发送最新的时间戳
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      this.downLoading = false// 手动关闭下拉刷新状态
      // 需要判断 最新的时间戳能否换来数据 如果能换来数据 就把最新的数据替换旧数据 如果不能 就告诉大家 暂时没有更新
      if (data.results.length) {
      // 如果有返回数据
      // 需要将articles替换
        this.articles = data.results// 历史数据全部被覆盖 假如你之前把数据拉到了最底下 意味着你将finished设置为true了
        if (data.pre_timestamp) {
          // 因为下拉刷新换来了新的数据  里面又有历史时间戳 说明有数据
          this.finished = false// 让列表可以继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来最新数据
        this.successText = '当前已经是最新数据了'
      }
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
