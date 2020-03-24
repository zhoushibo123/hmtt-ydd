<template>
  <div class="comment">
      <!-- 列表组件 可以实现上拉加载 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 循环项 -->
      <!-- <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()"> -->
          <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <van-tag plain @click="showReply=true">{{ comment.reply_count }}回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
     <!-- 输入框 -->
    <div class="reply-container van-hairline--top">
        <!-- 绑定输入内容 -->
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
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
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 接收评论
      offset: null// 表示分页依据 如果为空,表示从第一页开始
    }
  },
  methods: {
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
    }
  }
}
</script>

<style lang='less' scoped>
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
