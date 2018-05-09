/**
 *
 * @description 遍历src/view下的符合【RegExpStr】正则的文件
 */

const fs = require('fs');
const path = require('path');

// 结果文件
const fileInfoList = [];
// 查找的目录
const srcDir = 'src/view/';

function traverseFile(dir, RegExpStr) {
  const files = fs.readdirSync(dir, { encoding: 'utf-8' }, (err) => {
    console.log(err);
  });
  return files.map((file) => {
    const fPath = path.join(dir, file);
    if (fs.statSync(fPath).isDirectory()) {
      traverseFile(fPath, RegExpStr);
    } else if (RegExpStr && (new RegExp(RegExpStr)).test(fPath)) {
      const _str = fPath.replace(srcDir, '');
      const moduleName = path.dirname(_str);
      fileInfoList.push({
        fPath,
        moduleName,
      });
    } else if (!RegExpStr) {
      fileInfoList.push({
        fPath,
      });
    }
  });
}

module.exports = function (dir, RegExpStr) {
  traverseFile(dir, RegExpStr);
  return fileInfoList;
};
