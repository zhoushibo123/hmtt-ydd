<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell @click="showName=true" is-link title="名称" :value="user.name" />
      <van-cell @click="showGender=true" is-link title="性别" :value="user.gender===0?'男':'女'" />
      <van-cell @click="showDate" is-link title="生日" :value="user.birthday" />
    </van-cell-group>
    <!-- 放志头像弹层 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 放置昵称弹层 -->
    <van-popup :close-on-click-overlay="false" v-model="showName" style="width:80%">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <!-- 放置按钮来控制开关 -->
      <van-button block type="info" size="normal" @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 注册性别弹层的选择事件 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
         @cancel="showBirthDay=false"
        @confirm="confirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile } from '@/api/user'
export default {
  data () {
    return {
      showPhoto: false, // 控制头像弹层的状态
      showGender: false, // 控制性别弹层
      showName: false, // 控制昵称弹层
      showBirthDay: false, // 控制生日弹层
      minDate: new Date(1900, 1, 1), // 生日组件最小日期
      maxDate: new Date(), // 生日组件最大时间当前时间
      currentDate: new Date(), // 弹出层时显示的时间
      actions: [
        { name: '男' },
        { name: '女' } // 弹层中的选项
      ],
      nameMsg: '', // 错误信息
      user: {
        // 专门来放置用户资料
        name: '', // 用户昵称
        gender: 1, // 性别默认值
        birthday: '1998-05-15', // 生日默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    btnName () {
      // 关闭昵称弹层的方法
      // 做个限制
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 此时说明长度不符合要求
        this.nameMsg = '用户昵称长度应为1到7'
        return
      }
      // 成功的话
      this.nameMsg = '' // 清空提示
      this.showName = false
    },
    selectItem (item, index) {
      // 选中男或者女时触发
    // 0 ->男 1->女
      this.user.gender = index
      this.showGender = false// 关闭弹层
    },
    showDate () {
      // 显示生日弹层
      this.showBirthDay = true
      // 将当前的生日设置到选择日期上  将生日字符串转化成Date对象绑定到生日组件的currentDate上
      this.currentDate = new Date(this.user.birthday)
    },
    confirmDate () {
      // 确定生日的事件
      // 当前选择的的生日就是currentDate
      // 拿到选择的日期转化为字符串  date->字符串
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      // 关闭弹层
      this.showBirthDay = false
    },
    async  getUserProfile () {
      this.user = await getUserProfile()
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>
</style>
