/****
 * 需要导出一个对象
 * ***/
module.exports = {
  //   需要更改less中变量的配置
  css: {
    //   css相关
    loaderOptions: {
      // 所有的关于样式loader相关的选项
      less: {
        // 这里的选项写什么?
        // modifyVars 是less-loader的一个选项 通过这个选项可以改变 变量的值
        modifyVars: {
          // 直接覆盖变量  变量名不需要@
          blue: '#3296fa'

          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
        }
      }
    }
  },
  configureWebpack: (config) => {
    // config参数 就是当前vue-cli项目所偶遇的webpack配置
    // 如果想要改动就直接修改这个信息就行
    // 首先判断当前的打包环境 是开发环境好还是生产环境
    if (process.env.NODE_ENV === 'production') {
      // 只需要在生产环境中把所有的console删除掉 并且打包 这里的删除 不是删除源代码
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    // 这个东西是根据webpack的配置得来的
    }
  },
  publicPath: './'// 打包后的引用地址
}
