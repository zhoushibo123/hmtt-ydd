<template>
      <div class="container">
    <!-- 导航左侧有箭头 点击回到上一页 -->
    <van-nav-bar
  title="登录"
  left-arrow
  @click-left="$router.back()"
/>
<!-- 登录布局 -->
<!-- 外层需要用cell-group组件来包裹提供 边框 -->
<van-cell-group>
        <!-- 登录手机号 -->
        <!-- 双向绑定表单数据 v-model有个修饰符trim可以去除两端空格 -->
         <!-- input  和 blur事件都可以 -->
        <!-- vant组件 field提供了 错误信息的展示  error-message, 可以通过设置此属性进行错误信息的提示 -->
          <van-field @blur="checkMobile" :error-message="errorMessage.mobile" label="手机号" v-model.trim="loginForm.mobile"  placeholder="请输入手机号"></van-field>
        <!-- 验证码 -->
          <van-field @blur="checkCode" :error-message="errorMessage.code" label="验证码"  v-model.trim="loginForm.code" placeholder="请输入验证码">
            <!-- 插槽内容 -->
              <van-button slot="button" size="small" type="primary">发送验证码</van-button>
          </van-field>
    </van-cell-group>
     <!-- 登录按钮 -->
    <div class='login-box'>
      <van-button type="info" @click="login" round size="small"  block>登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user' // 引入login方法
import { mapMutations } from 'vuex'// 辅助函数
export default {
  data () {
    return {
      // 做数据校验 要完成数据的双向绑定
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810'// 验证码
      },
      // 此对象专门放置校验提示消息
      errorMessage: {
        mobile: '', // 手机号错误提示
        code: ''// 验证码错误提示
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 把updateUser方法映射到当前的motheds方法中
    checkMobile () {
      // 定义校验手机号的方法
      // 获取手机号 先判断是否为空 满足手机号的格式
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        // 如果到这里就没必要在继续了
        return false // 返回一个false 表示此轮没有通过 如果通过了就返回true
      }
      // 第二轮手机号格式校验
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 如果手机号不满足正则格式  .test()是检验正则与字符串匹配的结果 正确为true
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 如果到了这个位置说明校验通过了
      this.errorMessage.mobile = ''
      return true
    },
    checkCode () {
      // 检查验证码的方法
      if (!this.loginForm.code) {
        // 先判断是否为空
        this.errorMessage.code = '验证码不能为空'
        return false // 返回一个false  到这里就没必要继续了 第一轮校验没通过
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        // 如果验证码格式不满足正则规则则返回false
        this.errorMessage.code = '验证码必须为6位数字'
        return false // 第二轮校验
      }
      // 到这里说明校验成功了
      this.errorMessage.code = ''
      return true
    },
    // 手动校验整体校验
    async login () {
      // 检验手机号和验证码调用两个方法即可
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        // 如果两个检查都是true 就表示通过校验
        console.log('登录成功')
        // 调用接口
        const result = await login(this.loginForm)// 传递参数 mobile  code
        // result 中就是token和refresh_token 设置给vuex中state
        this.updateUser({ user: result })// 相当与更新当前的token和refresh_token
      // 应该跳转到主页 但是如果这个请求是别人401之后跳转过来的，就应该返回到原来界面
      // 1判断是否有需要跳转的页面有就跳转 没有就直接跳主页
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login-box{
  padding: 20px;
}
</style>
