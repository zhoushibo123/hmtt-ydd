<template>
  <div class="comment">
      <!-- 列表组件 上拉加载 评论是不能一口气加载完的 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 评论列表 -->
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <!-- 用户头像 -->
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <!-- 用户名称 -->
            <span class="name">{{ comment.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <!-- 时间  过滤器 过滤 -->
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <!-- 点击回复标签 弹出面板 而且要处理很多业务 -->
            <van-tag plain @click="openReply(comment.com_id.toString())">{{ comment.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>

    </van-list>
    <!-- 底部输入框 用来输入评论的 -->
    <div class="reply-container van-hairline--top">
        <!-- 绑定了评论内容 对文章评论和对评论评论 用的是一个输入框 -->
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <!-- 要么显示提交 如果点击了提交 首先把提交按钮隐藏 这样做的目的是防止你重复提交 -->
        <!-- 由于点击过快 会连续两次事件 接口是异步的 会造成两次评论 -->
        <span class="submit" @click="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的评论 弹出面板 -->
    <!-- 关闭面板时 将评论id设置为空 -->
      <van-action-sheet @closed='reply.commentId=null' v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <!-- 列表组件  关闭第一次自动执行load事件-->
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{  item.aut_name }}</span></p>
            <p>{{ item.content }}</p>
            <p><span class="time">{{ item.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

</template>

<script>

import * as articles from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的评论内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 神评论数据
      offset: null, // 偏移量 分页依据 第一页数据 null 第二页数据 offset  第一页最后一个id ...
      showReply: false, // 控制评论的评论面板是否显示
      reply: {
        // 此对象专门放置 面板加载信息
        loading: false, // 评论的评论的加载状态
        finished: false, // 评论的评论是否加载完毕
        offset: null, // 偏移量 作为评论的评论分页加载的时候 查询的依据
        list: [], // 存放 评论的评论的数据
        commentId: null // 用来存放评论Id  用这个id来去查询 这个评论的评论
      }
    }
  },
  methods: {
    // 提交评论
    async  submit () {
      // 点击时要做什么
      // 因为此时斌没有判断用户是否登录如果没登录要先登录 登录的话可以评论
      if (this.$store.state.user.token) {
        // 登录状态
        // 先确认是否输入了内容
        // 如果没有内容直接返回

        if (!this.value) return false
        this.submiting = true// 首先吧提交状态打开 避免重复提交当提交完毕后 手动关闭
        try {
          // 有内容
          // 休眠函数 来控制 执行的速度
          await this.$sleep(800) // 强制休眠800毫秒
          // 调接口 传3个参数
          const data = await articles.commentOrReply({
          // 参数3个
            content: this.value,
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 要么是评论id 要么是文章id
            art_id: this.reply.commentId ? this.$route.query.artId : null// 如果是对评论进行评论 需要传该评论的文章的id 需要传该评论属于哪个文章 如果是对文章进行评论 不要传这个参数
          })// 直接提交方法
          // 希望调用按方法后 添加评论数据直接添加我们的评论列表
          // data.new_obj 此obj数据是添加成功的一条数据 一个对象 这一条数据 我们需要加入到列表中
          // 两种场景 文章评论  评论回复
          if (this.reply.commentId) {
          // 此id存在 表示对评论进行回复
          // 将数据添加到评论回复
            this.reply.list.unshift(data.new_obj)
            // 如果对评论进行评论 需要找到对应的评论id 将回复数+1
            // 通过devtos插件 查看comment组件
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)

            // 当前评论id的id 找到就将回复数量+1
            // 寻找文章评论中 等于 当前评论id的id
            comment && comment.reply_count++ // 如果找到就将 回复数量+1
            // if (aa) {
            //   this.comment.reply_count++
            // }
          } else {
            // 如果不存在表示对文章进行评论
            this.comments.unshift(data.new_obj)
          }
          // 清空输入框
          this.value = ''
        } catch (error) {
          this.$znotify({ message: '评论失败' })
        }

        this.submiting = false// 关闭按钮加载状态
      } else {
        // 游客
        // 想要评论就要先登录
        try {
          await this.$dialog.confirm({
            message: '如果想要评论，需要先登录'
          })
          // 如果点击确定执行
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullpath// 此地址是完整的地址 是用户登录完成后回到上一个界面
            }
          })
        } catch (error) {
          console.log(error.message)
        }
      }
    },
    openReply (commentId) {
      //   打开回复面板 只会在点击回复时调用一次
      this.showReply = true
      //   处理传过来的id 赋值给data中
      this.reply.commentId = commentId
      //   先把之前的数据清空 再重新拉去最新的 重置数据
      this.reply.list = []
      this.reply.offset = null// 因为希望点击弹出回复面板的时候 是新的数据 从第一页开始
      this.reply.finished = false// 手动打开
      this.reply.loading = true // 主动打开加载状态 因为此时没有 主动检查

      this.getReply() // 弹出评论的评论的层时 主动的去请求一次数据
    },
    async  onLoad () {
      //   加载方法 滚动条距离底部超过一定距离就会执行
      const { artId } = this.$route.query// 拿到对应的参数 任何组件的属性中都有一个$route选项
      const data = await articles.getComments({
        type: 'a', // a 表示文章评论  c 表示回复的评论
        source: artId, // 表示你查询谁的id
        offset: this.offset// 赋值当前的偏移量
      })
      //   成功后 追加到尾部
      //   首先应该加载状态栏

      this.comments.push(...data.results)
      this.loading = false// 关闭上拉加载状态
      //   还需要判断是否还有下一页数据
      this.finished = data.end_id === data.last_id// 如果两个id相等
      //   如果没有
      if (!this.finished) {
        // 表示 还没没结束
        // data.last_id是 当前页的最后一个id 查询下一页数据
        this.offset = data.last_id
      }
    },
    async getReply () {
      // 此方法用来获取回复的数据
    //   此方法也会在第二页第三页第四页时执行
      const data = await articles.getComments({
        type: 'c', // a 表示文章评论  c 表示回复的评论
        source: this.reply.commentId, // 获取谁的评论的id
        offset: this.reply.offset// 评论的评论的分页依据
      })
      //   将数据追加到队尾
      this.reply.list.push(...data.results)
      this.reply.loading = false// 关闭加载状态
      this.reply.finished = data.last_id === data.end_id // 如果它俩相等 表示 game over
      if (!this.reply.finished) {
        // 如果不等 表示还有下一页数据
        this.reply.offset = data.last_id // 将下一页的分页依据设置给当前的数据
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
