module.exports = {
    //本地端口号：
    localPORT: '9090',
    // 代理的远程机
    targetServer: 'http://xxxxx:8080/',
    //开发环境的入口文件
    dev: [
      'rxjs'
    ],
  // 打包发布的入口文件。将开发环境和发布环境分开不会导致覆盖别人的代码
  // modulesCfg.prod 内仅仅配置自己现在开发的入口文件
  prod: [
   'test'
  ]
}
