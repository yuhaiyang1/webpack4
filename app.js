
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
  stats: {
    chunks: false
  },
  historyApiFallback: true,
  publicPath: config.output.publicPath,
  disableHostCheck: true,
  proxy: {
    '/': {
      target: modulesCfg.targetServer,
      secure: false,
    },
  }
});
console.log(process.env.NODE_ENV, "start server...");
server.listen(process.env.port, "0.0.0.0", function() {
  //console.log("http://localhost:9090/",config.output.publicPath);
});
