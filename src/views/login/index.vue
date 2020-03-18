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
import { mapMutations } from 'vuex'// 辅助函数 可以把mutations方法映射到methods方法中
export default {
  data () {
    return {
      // 做数据校验 要完成数据的双向绑定
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
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
    async  login () {
      //  校验手机号和验证码
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        console.log('校验通过')

        // 如果两个检查都是true 就表示通过 了校验
        // 校验通过之后 要去调用接口 看看用户名和密码正确与否
        // axios 但是后端接口 不论你成功或者失败 它返回的状态码都是200
        try {
          const result = await login(this.loginForm)
          // 后端 现在把所有手机号 都认为是成功
          console.log(result) // 打印结果
          // 拿到token之后 应该把token设置vuex中的state
          // 要去修改vuex中的state必须通过 mutations
          // this.$store.commit('')  // 原始方式
          this.updateUser({ user: result }) // 相当于更新当前的token 和 refresh_token
          // 应该跳转到主页 but 如果此时 你这个登录 是 别人401之后跳转过来的 你就应该回到那个跳转过来的页面
          // 1 判断是否有需要跳转的页面 如果有 就跳转 如果没有 不用管 直接跳到主页
          const { redirectUrl } = this.$route.query // query查询参数 也就是 ?后边的参数表
          // redirectUrl有值的话 跳到该地址 没值的话 跳到 主页
          this.$router.push(redirectUrl || '/') // 短路表达式
        } catch (error) {
          // 失败时执行 提示用户 登陆失败
          // console.log('登录失败')
          // console.log(error)
          this.$znotify({ message: '用户名或者验证码错误' })
        }
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
