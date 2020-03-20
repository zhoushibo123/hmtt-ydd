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
      <van-cell icon="info-o" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants'// 引入常量变量
export default {
  data () {
    return {
      isReport: false, // 是否举报反馈垃圾内容
      reports// 相当于定义一个reports变量来源于 constants中的常量reports
    }
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
