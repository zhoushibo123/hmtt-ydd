<template>
 <div class="container">
      <div class="user-profile">
      <div class="info">
        <van-image round :src="userInfo.photo" />
        <h3 class="name">
          {{userInfo.name }}
          <br />
          <van-tag size="mini">申请认证</van-tag>
        </h3>
      </div>
      <van-row>
        <van-col span="8">
          <p>{{ userInfo.art_count }}</p>
          <p>动态</p>
        </van-col>
        <van-col span="8">
          <p>{{ userInfo.follow_count }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="8">
          <p>{{ userInfo.like_count }}</p>
          <p>粉丝</p>
        </van-col>
      </van-row>
    </div>
    <van-row class="user-links">
      <van-col span="8">
        <van-icon name="newspaper-o" color="#7af" />我的作品
      </van-col>
      <van-col span="8">
        <van-icon name="star-o" color="#f00" />我的收藏
      </van-col>
      <van-col span="8">
        <van-icon name="tosend" color="#fa0" />阅读历史
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell icon="edit" title="编辑资料" to="/user/profile" is-link />
      <van-cell icon="chat-o" title="小智同学" to="/user/chat" is-link />
      <van-cell icon="setting-o" title="系统设置" is-link />
      <van-cell icon="warning-o" title="退出登录" @click="lgout" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    ...mapMutations(['delUser', 'updataPhoto']), // 引入删除token方法和更新头像的方法
    async getUserInfo () {
      // 用户个人信息赋值给data中的变量
      this.userInfo = await getUserInfo()
      // 获取了用户信息
      this.updataPhoto({ photo: this.userInfo.photo })// 用mutation来设置头像
    },
    async lgout () {
      // 登出操作
      try {
        await this.$dialog.confirm({
          message: '确定要退出登录吗'
        })
        this.delUser()
        // 跳到登录页
        this.$router.push('/login')
      } catch (error) {

      }
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang='less' scoped>
.user {
  &-profile {
    width: 100%;
    height: 150px;
    display: block;
    background: #3296fa;
    color: #fff;
    .info {
      display: flex;
      padding: 20px;
      align-items: center;
      .van-image{
        width: 64px;
        height: 64px;
      }
      .name {
        font-size: 16px;
        font-weight: normal;
        margin-left: 10px;
      }
      .van-tag {
        background: #fff;
        color: #3296fa;
      }
    }
    p{
      margin: 0;
      text-align: center;
    }
  }
  &-group {
    margin-bottom: 15px;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
      padding-bottom: 5px;
    }
  }
}
</style>
