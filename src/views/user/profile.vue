<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料"  @click-right="saveUser" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
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
      <!-- 注册点击事件 -->
      <van-cell @click="openFile" is-link title="本地相册选择图片"></van-cell>
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
     <!-- 放置一个input用来上传头像 不能让人看到 -->
     <!-- vue通过ref获取DOM对象 -->
     <!-- 上传了文件就触发了change事件 -->
  <input @change="upload" ref="myFile" type="file"  style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, saveUserInfo } from '@/api/user'
import { mapMutations } from 'vuex'
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
    ...mapMutations(['updataPhoto']), // 引入更新头像的方法
    async saveUser () {
      // 获取用户信息
      try {
        await saveUserInfo(this.user) // 传入user对象
        this.$znotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$znotify({ message: '保存失败' })
      }
    },
    openFile () {
      // 打开选择的文件的对话框 触发input file的动作
      this.$refs.myFile.click()// 触发事件就会弹出对话框
    },
    async  upload (params) {
      // input的change事件
      // 当选择完成后就可以修改头像了
      // 调接口
      // 因为是formdata格式
      // console.dir(this.$refs.myFile)
      // // debugger
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0])
      const result = await updatePhoto(data)// 上传头像
      // 把头像显示在页面上
      this.user.photo = result.photo
      // 修改成功之后也需要把头像设置给vuex
      this.updatePhoto({ photo: result.photo })
      this.showPhoto = false
    },
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
