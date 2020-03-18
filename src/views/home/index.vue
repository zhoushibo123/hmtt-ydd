<template>
  <div class="container">
<!-- 放置tabs组件 -->
<van-tabs>
  <!-- 内部放置子标签 title值为当前显示的内容 -->
  <!-- vant-tab是vant组件的样式 -->
  <van-tab :title="`标签${item}`" v-for="item in 10" :key="item">
    <!-- 生成若干单元格 -->
    <!-- scroll-wrapper为什么叫这个 以为内样式中对他进行了修饰滚动条设置 -->
    <div class="scroll-wrapper">
   <van-cell-group>
      <van-cell v-for="item in 20" :key="item" title="标题" value="内容"></van-cell>
    </van-cell-group>
    </div>

  </van-tab>
</van-tabs>
 <!-- 在tabs下放置图标  编辑频道的图标 -->
      <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  components: {}
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
