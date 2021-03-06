module.exports = {
  //  - postcss-pxtorem 是一款 postcss 插件，用于将单位转化为 rem,我们开发时,原来怎么写 现在还怎么写,会自动转成rem
//  font-size: 30px =>  font-size: 30px /基准值 rem

  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
// - rootValue 是转换px的基准值，参考设备iPhone6，设备宽度375px。
// flexible 在iPhone6设备设置的  html--->font-size 也为37.5px 。
// 但是 设计稿 尺寸750px 大小，所以在设计稿量取的尺寸使用时候需要  除以2  。
