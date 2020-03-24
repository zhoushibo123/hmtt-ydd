<template>
  <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <van-button :loading="followLoading" @click="follow" round size="small" type="info">{{article.is_followed ? '已关注':"+关注"}}</van-button>
      </div>
      <div class="content" v-html="article.content">
        <!-- 文章内容有标签有样式 v-html -->
      </div>
      <div class="zan">
        <!-- 根据态度显示点赞或者不喜欢 -->
        <van-button round size="small" :class="{ active:article.attitude===1}" class="active" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{ active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 放置遮罩层 -->
      <!-- 当前文章加载在状态 -->
      <van-overlay :show="loading">
        <!-- 放置加载进度条 -->
        <div class="loading">
 <van-loading></van-loading>
        </div>

      </van-overlay>
      <!--放置comment组件 到 detail内部 因为有padding  -->
      <Comment></Comment>
    </div>

  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'// 引入获取文章详情的方法
import { followUser, unFollowUser } from '@/api/user'// 引入关注/取消关注方法
import Comment from './components/comment' // 引入评论组件
export default {
  components: {
    Comment
  },
  data () {
    return {
      article: {}, // 用来接收文章详情数据
      followLoading: false, // 控制按钮加载状态
      loading: false// 遮罩层状态
    }
  },
  methods: {
    async  getArticleInfo () {
      // 获取文续航详情数据
      const { artId } = this.$route.query// 拿到url？后边的文章id
      this.article = await getArticleInfo(artId)
    },
    async  follow () {
      // 关注或者取消关注
      // 调用关注/非关注方法
      // 如果是没关注状态调关注   关注状态调取消关注方法
      // 依靠返回携带的状态判断状态
      this.followLoading = true
      try {
        if (this.article.is_followed) {
        // 取消关注
          await unFollowUser(this.article.aut_id)// 传入作者id
        } else {
        // 关注
          await followUser({ target: this.article.aut_id })// 传入作者id
        }
        // 如果成功了执行
        // pc端 是 重新加载
        // 移动端 不会重新加载 只会修改对应的数据状态
        this.article.is_followed = !this.article.is_followed // 将状态改为对立状态
        this.$znotify({ type: 'success', message: '操作成功' })
      } catch (error) {
        // 失败进入catch
        // error.message 是报错信息 就可以知道哪里出问题 这个错误是从哪里抛出来的
        //  现在写的是中间代码   => 编译的  =>  报错指示的是编译之后的代码 => 推导出哪里出问题了

        this.$znotify({ message: '操作失败' })
      } finally {
        // 无论try还是catch最终都会执行这个
        this.followLoading = false
      }
    }
  },
  created () {
    this.getArticleInfo()// 调用获取文章详情方法
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
