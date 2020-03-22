<template>
  <div class="channel-edit">
      <!-- 我的频道 -->
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
          <!-- 我的频道的循环选项 -->
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <span class="f12">{{item.name}}</span>
             <!-- 在编辑模式显示叉号 v-if  第一个推荐频道不能删除 依靠索引来判断 因为第一个永远不显示叉号-->
          <van-icon v-if="index!==0 && editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
        <!-- 可选频道 -->
        <!-- 我的频道的数据 是当前用户自己的数据（在登陆情况下自己的频道 或者游客模式下自己的频道）
        可选频道＝全部频道-我的频道
         -->
         <!-- 循环部分 -->
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in channels" :key="item.id">
          <span class="f12">{{item.name}}</span>

          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editing: false// 用这个状态来控制是否显示删除图标
    }
  },
  props: {
    //   props对象形式传值
    channels: {
      required: true,
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
