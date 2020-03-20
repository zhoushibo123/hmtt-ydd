<template>
<!-- 外层元素 -->
  <div class="more-action">
      <!-- 单元格组1 -->
      <!-- v-if v-else 前边满足前边显示 前边不满足后边显示 -->
    <van-cell-group v-if="!isReport">
        <!-- 点击不感兴趣调用不感兴趣接口 也需要自定义事件 往父组件传递不喜欢的文章id -->
      <!-- 实际上是调用父组件的方法 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
      <!-- 单元格组2 -->
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell>侵权</van-cell>
      <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isReport: false// 是否举报反馈垃圾内容
    }
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
