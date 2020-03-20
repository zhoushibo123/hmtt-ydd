<template>
  <div class="container">
      <!-- 放置tabs组件 -->
      <van-tabs>
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
      <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
      <!-- 放置组件标签van-popup弹层组件 -->
      <van-popup style="width:80%" v-model="showMoreAction">
        <!-- 放置反馈组件 -->
      <MoreAction />
      </van-popup>

  </div>
</template>

<script>
import ArticleList from './components/article-list'// 文章列表组件
import MoreAction from './components/more-action' // 引入反馈弹层组件
import { getMyChannels } from '@/api/channels'
export default {
  name: 'Home',
  components: {
    ArticleList, MoreAction
  },
  data () {
    return {
      channels: [], // 接受频道的数据
      showMoreAction: false // 是否弹层 默认不显示弹层
    }
  },
  methods: {
    openAction () {
      // 此方法在article-lis组件触发ShowArticle时触发
      // 弹出弹窗
      this.showMoreAction = true
    },
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
