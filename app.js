
/**
 * zwl 版本
 * webpack server
 */
'use strict'
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const config = require("./webpack.config.js");
const compiler = webpack(config);
const fs = require('fs');
const modulesCfg = require('./modulesCfg');
const server = new WebpackDevServer(compiler, {
  contentBase: './dist/',
  inline: true,
  hot: true,
  clientLogLevel: 'none',
  stats: {
    chunks: false,
    modules: false
  },
  historyApiFallback: true,
  publicPath: config.output.publicPath,
  disableHostCheck: true,
  proxy: {
    // '/frmLossH5/upload.do': {
    //     target: 'http://218.244.135.116:8080/',
    //     secure:  false
    // },
    // "/frmLossH5/imageUpload.do": {
    //     target: 'http://218.244.135.116:8080/',
    //     secure:  false
    // }
    //优化 凡是以‘／’开头的且非src和dist的url都将被代理到后端，src和dist是本地开发使用的一些临时数据
    './getCatDetail*': {
      target: 'http://218.244.135.116:8080/', //小菜宝 ： http://120.55.113.22:8880/
      secure: false
    },
    '/': {
      target: modulesCfg.targetServer, //'http://192.168.0.107:8080/',
      secure: false,
      changeOrigin: true
      // bypass: function(req, res, proxyOptions) {
      //     //console.log('Z000',req.url,'Zwilling1',res,'Zwilling2',proxyOptions,"Zwilling3");
      //     if (!/^(\.\/|\/){1}(?!(src|dist|html|js)\/)\/*/.test(req.url)) { // 阅读源码
      //         console.log('Skipping proxy for browser request.');
      //         return req.url;
      //     }
      // }
    },
  }
});
console.log(process.env.NODE_ENV, "start server...");
server.listen(process.env.port, "0.0.0.0", function() {
  //console.log("http://localhost:9090/",config.output.publicPath);
});
