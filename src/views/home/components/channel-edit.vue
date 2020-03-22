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
            <!-- 这个功能 需要注册我的频道的点击事件,将点击的频道id传给 父组件,父组件根据id找到对应的索引,切换tab页索引到对应的tab页下首先点击频道触发自定义事件 -->
            <!-- selectChannel自定义事件名 传递点击频道的id -->
          <span @click="$emit('selectChannel',index)" :class="{red:index===activeIndex}" class="f12">{{item.name}}</span>
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
         <!-- 相当于一个全部数据大数组减去一个我的频道的小数组 -->
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>

          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'// 获取所有频道的方法
export default {
  data () {
    return {
      editing: false, // 用这个状态来控制是否显示删除图标
      allChannels: []// 用来接收所有频道的数据
    }
  },
  props: {
    //   props对象形式传值
    channels: {
      required: true,
      type: Array,
      default: () => []
    },
    // 选中页签变为红色
    activeIndex: {
      required: true,
      type: Number,
      default: 0
    }
  },
  methods: {
    async  getAllChannels () {
      const data = await getAllChannels()
      // await 成功之后执行  把后端数据赋值给allChannels变量
      this.allChannels = data.channels
    }
  },
  computed: {
    //   为什么要用计算属性? 可选频道 其实是一个动态的结果  全部数据(data) - 用户频道(props) => 重新计算频道数据 => 缓存
    //   可选频道 计算属性必须要求有返回值
    optionalChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels()// 调用获取全部频道的数据
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
