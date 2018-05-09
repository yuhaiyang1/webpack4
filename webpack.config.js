
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const traverseFile = require('./tools').traverseFile
const srcDir = './src/view'
let modulesCfg
try {
  modulesCfg = require('./modulesCfg')
} catch (e) {
  console.log(chalk.red('======================================\n 未找到 modulesCfg.js，请参照README.md进行配置....\n\n======================================'));
}
// 设置系统环境的端口号
process.env.port = modulesCfg.localPORT
const __NODE_ENV__ = process.env.NODE_ENV || 'develop' // 环境原始值
const webpackConfig = {
  // devtool: 'source-map',
  entry: {},
    // 项目输出的目录
    // [name] 代表 entry中的key
  output: {
    path: path.join(__dirname, 'dist'),
    chunkFilename: '[name].chunk.js',
    filename: '[name].js'
  },
  resolve: {
    modules: [path.resolve('src'), 'node_modules'],
    extensions: ['.js', '.jsx'],
    /**
     * 模块别名，如果有模块的路径较为复杂可以添加到这里，
     * 如原先需要 require('/Users/kkt/Documents/erp/components/index.js')
     * 现在只需要 require('components')
     * 但是需要注意不要与node_modules中的模块名称重复
     */
	  // z这里放一些公用组件
    alias: {
//       components: path.dirname(`${__dirname}/src/components/index.js`),
//       utils: path.dirname(`${__dirname}/src/utils/index.js`),
//       commonStyle: path.dirname(`${__dirname}/src/utils/common.style.less`),
//       BussinessCom: path.dirname(`${__dirname}/src/components/BussinessCom/index.js`),
//       PureCom: path.dirname(`${__dirname}/src/components/PureCom/index.js`)
    }
  },
  mode: __NODE_ENV__ === 'develop' ? 'development' : 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
    ]
  },
  module: {
    // 只有不带global.css/less/scss 的才走css modules
    rules: [
      {
        test: /global\.css$/,
        use: ['css-loader?modules&localIdentName=[local]-[hash:base64:5]']
      },
      {
        test: /^((?!global).)*\.css$/,
        use: ['css-loader']
      },
      {
        test: /global\.less$/,
        use: ['css-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]!autoprefixer-loader!less-loader'],
      },
      {
        test: /^((?!global).)*\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        // exclude: /node_modules/
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(jpg|png|gif|jpeg|svg)$/,
        use: 'url-loader?limit=8192'
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: __NODE_ENV__ === 'develop' ? JSON.stringify('develop') : JSON.stringify('prod')
      }
    }),
  ]
}

if (__NODE_ENV__ === 'develop') {
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  webpackConfig.externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    jquery: '$',
    highcharts: 'Highcharts',
    moment: 'moment'
  }
}

/**
 * 区分modulesCfg.dev、modulesCfg.prod的文件列表，防止覆盖他人的js或者旧的页面
 * modulesCfg.prod 内仅仅配置自己现在开发的入口文件
 */
if (__NODE_ENV__ === 'develop') {
	// 本地开发使用，对应develop
  AddEntryFile(modulesCfg.dev)
} else {
	// 线上测试使用，对应 preProd、prod
  AddEntryFile(modulesCfg.prod)
}

/**
 * 现在入口文件都以  index.entry.js  文件作为入口文件
 * 只从modulesCfg.js内读取入口文件路径，一般不会需要打包所有的页面，所以暂时不再处理，毕竟有风险。
 * 优化：如果是页面则直接configSingleEntry这个singlefile。如果是某个模块，则加入该模块所有的页面
 */
function AddEntryFile(entries) {
  if (entries.length == 0) {
    console.log(chalk.red('\n sb?！ 请先配置一下打包的入口文件。。\n'));
    return;
  } else {
    console.log(entries, entries.length)
  }
	// 注意filename可能为数组，需要遍历,这里需要做一个是否存在的判断
  for (let i = 0; i < entries.length; i++) {
    const fileName = entries[i];
    // 校验是否存在文件
    if (fs.existsSync(path.join(srcDir, fileName, 'index.entry.js'))) {
      console.log(chalk.green('get entry js success! ', fileName));
      configSingleEntry(fileName);
    } else if (fs.existsSync(path.join(srcDir, fileName)) && fs.statSync(path.join(srcDir, fileName)).isDirectory()) { // 是否存在 && 是否是文件夹 那么就有可能是模块
      // 如果是文件夹，则遍历找文件
      const _entries = traverseFile(path.join(srcDir, fileName), 'entry.js').map(fileInfo => path.dirname(fileInfo.fPath).replace('src/view/', ''));
      AddEntryFile(_entries);
    } else {
      console.log(chalk.red('InValid! under ', fileName, ' there is no entry file! '));
      return;
    }
  }
}

/**
 * 配置单个文件入口
 * @param  {[string]} fileName [文件名]
 */
function configSingleEntry(fileName) {
  webpackConfig.entry[`${fileName}/index`] = [`./src/view/${fileName}/index.entry.js`];
  if (__NODE_ENV__ == 'develop ') {
    webpackConfig.entry[`${fileName}/index`].push(
			`webpack-dev-server/client?http://localhost:${modulesCfg.localPORT}`,
			'webpack/hot/only-dev-server'
		)
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    filename: `${fileName}/index.html`,
    template: `./src/view/${fileName}/index.html`,
    inject: true,
    chunks: [`${fileName}/index`],
    hash: false,
    chunksSortMode: 'dependency',
  }));
}

module.exports = webpackConfig;
