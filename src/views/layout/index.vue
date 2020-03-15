<template>
  <div class="container">
      <!-- 导航组件 fixed固定在顶部 -->
      <!-- 当页面是/user的时候页面不应该显示导航栏 v-if判断  lick-right点击事件跳转搜索页   -->
        <van-nav-bar fixed title="黑马头条" @click-right="$router.push('/search')"  right-text="搜索" v-if="$route.path!=='/user'" ></van-nav-bar>
        <!-- <van-icon name="search" /> -->
        <!-- 二级路由容器 -->
        <div class="my-wrapper" :class="{noTop : $route.path==='/user'}">
        <router-view></router-view>
        </div>

      <!-- 标签栏组件route开启路由模式相当于router-link -->
      <van-tabbar route>
      <!-- router-link  to  -->
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
</div>
</template>

<script>
export default {

}
</script>

<style scoped lang='less'>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
