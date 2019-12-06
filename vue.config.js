var webpack = require('webpack')
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        // 'window.Quill': 'quill/dist/quill.js',
        // 'Quill': 'quill/dist/quill.js'
      }),
    ]
  },
  // publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  // outputDir: "dist",
  // assetsDir: "assets",
  // filenameHashing: false,
  // lintOnSave: true,
  // productionSourceMap: false,

  // devServer: {
  //   // host: "localhost",
  //   // port: 8080,
  //   https: false,
  //   open: true,
  //   // proxy: 'http://39.104.164.162:8895/'  //测试
  //   // proxy: 'https://filetest.xhkjedu.com'
  //   // proxy: 'http://192.168.1.120:8895/'  //詹杰
  //   // proxy: 'http://192.168.1.195:8895/'  //刘涛
  //   proxy: 'http://2l57r21499.wicp.vip:58224/'  //刘涛
  // }
}
