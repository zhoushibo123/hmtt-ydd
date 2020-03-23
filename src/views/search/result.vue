<template>
  <div class="container">
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <!-- 将 fixed导航栏固定在顶部 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 防止搜索结果列表 实现上拉加载 load会根据滚动条距离下边框的距离自动触发加载数据-->
    <van-list v-model="upLoading" :finished='finished' @load="onLoad">
      <van-cell-group>
        <!-- 有可能是大数字类型 做转换 -->
        <van-cell v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item. aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <!-- 用过滤器来处理相对时间 -->
              <span>{{item.pubdate | relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import * as Articles from '@/api/articles'
export default {
  data () {
    return {
      upLoading: false, // 上拉加载状态
      finished: false, // 表示当前的加载是否全部完成了 如果全部完成 应该将finished设置成true
      articles: [], // 放置搜索结果文章的
      page: {
        page: 1, // 当前第几页
        per_page: 10 // 每页的多少条
      }
    }
  },
  methods: {
    async onLoad () {
      // 该方法会在滚动条滚动到底部时执行
      // 调接口
      const { q } = this.$route.query// 获取query参数
      const data = await Articles.searchArticle({ ...this.page, q })// 传递三个参数page per_page q
      this.articles.push(...data.results)// 返回结果追加给数组
      this.upLoading = false// 关闭上拉加载的状态

      if (data.results.length) {
        // 认为有下一页
        // 应该把页面切到下一页
        this.page.page++
      } else {
        // 如果没有下一页
        this.finished = true// 手动关闭没有数据了
      }
    }

  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
