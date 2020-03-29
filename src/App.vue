<template>
  <div id="app">
    <keep-alive>
      <!-- 如果不加控制会缓存所有的组件实例只要是keep-alive包裹就缓存不包裹就不缓存 -->
      <!-- 根据当前的meta中isAlive来确定是否缓存$route.meta.isAlive -->
 <!-- 当缓存时 里面的生效 -->
<router-view v-if="$route.meta.isAlive"/>
    </keep-alive>
    <!-- 条件渲染  当不缓存时 外面的生效-->
<router-view v-if="!$route.meta.isAlive"></router-view>
  </div>
</template>

<style lang="less">

</style>
