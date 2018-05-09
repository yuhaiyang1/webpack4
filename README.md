# webpack4
支持多页面打包的webpack4  
* git clone https://github.com/yuhaiyang1/webpack4.git  
* npm i   
* 然后在 modulesCfg.js 里 配置  
* targetServer: 要访问的host或者ip 主要起代理作用 处理跨域  
* dev 数组 写文件路径 ， 多页面就是数组格式 这个是开发环境   
* prod 要打包文件路径 ， 其他同上 
* 目前只配置 react开发环境 如果想支持vue 可以自行下载对应loader 和plugin 扩展配置    
* 本地开发 modulesCfg.js 配置好以后 npm run dev  
* 打包 modulesCfg.js 配置好以后 npm run bulid 打包后的文件在 dist 里面  





