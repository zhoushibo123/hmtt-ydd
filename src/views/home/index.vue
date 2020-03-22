<template>
  <div class="container">
      <!-- 放置tabs组件 -->
      <!-- v-model绑定当前激活的页签 -->
      <van-tabs v-model="activeIndex">
         <!-- 内部需要放置子 标签  title值为当前显示的内容-->
         <!-- van-tab是vant组件的样式  -->
         <van-tab :title="item.name" v-for="item in channels" :key="item.id">
            <!-- 生成若干个单元格 -->
            <!-- 这里为什么叫scroll-wrapper  因为样式中对它进行了设置 -->
            <!-- <div class='scroll-wrapper'>
              <van-cell-group>
                <van-cell title="标题" value="内容" :key="item" v-for="item in 20"></van-cell>
              </van-cell-group>
            </div> -->
            <!-- 有多少个tab 就有多少个 article-list  相当于多个article-list实例-->
             <!-- channel_i通过父子传值 props -->
             <!-- 父组件中监听自定义事件弹出显示层 -->
             <ArticleList @ShowArticle="openAction" :channel_id='item.id'></ArticleList>
         </van-tab>
      </van-tabs>
      <!-- 在tabs下放置图标  编辑频道的图标 -->
      <!-- 点击图标显示编辑弹层 -->
      <span class="bar_btn" @click="showChannelEdit=true">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
      <!-- 放置组件标签van-popup弹层组件 -->
      <van-popup style="width:80%" v-model="showMoreAction">
        <!-- 放置反馈组件 -->
        <!-- 监听子组件的自定义事件 -->
        <!-- 不喜欢文章和举报文章用一个方法 -->
        <!-- @事件名=方法名（$event,参数） -->
        <!-- $event是事件参数 在h5中是事件参数 在自定义事件中就是自定义事件传出的第一个参数 -->
      <MoreAction @dislike="dislikeOrReport('dislike')"  @report="dislikeOrReport('report',$event)"   />
      <!-- <MoreAction @dislike="dislikeOrReport('dislike')"  @report="dislikeOrReport('report',$event)" /> -->
      </van-popup>
  <!-- 频道编辑组件放在弹出面板的组件title标题 round是否显示圆角v-bin动态绑定 -->
  <van-action-sheet v-model="showChannelEdit" title="编辑频道" :round="false">
    <!-- 频道编辑组件 -->
    <!-- 因为我的频道 的数据在父组件上 所以要父子传值给编辑频道组件 -->
    <ChannelEdit :channels='channels'>

    </ChannelEdit>
  </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'// 文章列表组件
import MoreAction from './components/more-action' // 引入反馈弹层组件
import { getMyChannels } from '@/api/channels'
import { dislikeArticle, reportArticle } from '@/api/articles'// 调用不感兴趣接口方法和举报文章方法
import eventbus from '@/utils/eventbus'// 公共事件处理器
import ChannelEdit from './components/channel-edit'// 引入编辑频道组件
export default {
  name: 'Home',
  components: {
    ArticleList, MoreAction, ChannelEdit
  },
  data () {
    return {
      channels: [], // 接受频道的数据
      showMoreAction: false, // 是否弹层 默认不显示弹层
      articleId: null, // 用来接收article-list传进来的文章id
      activeIndex: 0, // 当前频道对应的索引
      showChannelEdit: false// 是否显示频道编辑组件 默认不显示
    }
  },
  methods: {
    openAction (artId) {
      // 此方法在article-lis组件触发ShowArticle时触发
      // 弹出弹窗
      this.showMoreAction = true
      // alert(artId)
      // 将id存到data变量里
      this.articleId = artId
    },
    // 在more-action组件触发dislike时触发不感兴趣这个方法
    async dislikeOrReport (operateType, type) {
      // alert(type)
      // alert(2)
      // 调用不感兴趣接口
      try {
        // 两个方法合并 需要一个参数来判断
        // operateType是操作类型 如果是dislike就是不喜欢  如果是report就是举报文章
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId// 不感兴趣文章的id
          // await下方的逻辑 是 resolve(成功)之后 的执行
        }) : await reportArticle({
          target: this.articleId,
          type// 这里type通过$event传出来
        })
        this.$znotify({
          type: 'success',
          message: '操作成功'
        })
        // 还应该利用事件广播的机制 通知对应的tabs删除对应的数据
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)// 要传递对应的文章id
        // 还要告诉监听事件得人当前这篇文章属于哪个频道 可以传递当前频道id
        // this.channels[activeIndex].id 当前频道id
        // 监听了这个事件的组件根据id删除文章
        this.showMoreAction = false// 关闭弹层
      } catch (error) {
        this.$znotify({
          message: '操作失败'
        })
      }
    },
    // 举报文章的方法
    // async reportArticle (type) {
    //   try {
    //     // 调用接口
    //     await reportArticle({
    //       target: this.articleId,
    //       type
    //     })
    //     // 举报成功在await下方执行
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)// 要传递对应的文章id
    //     this.showMoreAction = false// 关闭弹层
    //   } catch (error) {
    //     // 失败之后
    //     this.$znotify({
    //       type: 'success',
    //       message: '操作失败'
    //     })
    //   }
    // },
    async getMyChannels () {
      const data = await getMyChannels() // data是接受返回的数据结果
      this.channels = data.channels // 将返回数据中的channels赋值给 channels数组
    }
  },
  created () {
    this.getMyChannels()// 实例化结束调用获取频道方法
  }
}
</script>
<style lang='less' scoped>
// 控制弹层面板样式 编辑频道组件
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
