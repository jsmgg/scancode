const fs = require("fs");
const glob = require('glob');
const pathObj = require("path");
const {jscpd} = require('jscpd');
const {exec} = require('../util/index');
/**
 * 
 * @param {*} absoluteDir 
 * @param {*} ignore 
 * {
      repeatScanLines:0,//重复代码扫描总行数，去除了文件收尾的注释行数,其他地方的注释和空行全部包含
      duplicatedLines:0,//重复行数
      percentage:0,//重复百分比
      data:[]//重复代码位置
    }
 */
function getRepeatCode(absoluteDir, ignore=[]){
  console.log(`开始重复代码扫描...`)
  const outputPath = pathObj.resolve(absoluteDir, `../${Date.now()}${Math.random()*9999999|0}`)
  fs.mkdirSync(outputPath);
  const resultPath = `${outputPath}/jscpd-report.json`;
  const ignorePath = ignore.reduce((res, regx)=>{
    return res.concat(glob.sync(regx,{
      cwd:absoluteDir
    }));
  }, []).map(item=>`${pathObj.resolve(absoluteDir, item)}`).join(',');
  return jscpd([
    '','',
    absoluteDir,
    '-o',outputPath,
    '-p',`**/*.{js,ts,tsx,vue,scss,css}`,
    '-m','weak',
    '-i',ignorePath,
    '-r','json',//console
    '-l',10, //最小行数,小于该值的文件将被忽略
    '-x',5000,//最大行数
    '-z','1000kb',//最大文件体积
    '--store','leveldb',
    '-s'
  ]).then(()=>{
    let result = fs.readFileSync(resultPath);
    result = JSON.parse(result);
    const {
      lines,//总行数
      duplicatedLines,//重复行数
      percentage//重复百分比
    } = result.statistics.total;
    const data= (result.duplicates||[]).map(item=>{
      const {
        firstFile = {},
        secondFile = {}
      } = item;
      return {
        lines: item.lines,
        firstFile: {
          path: firstFile.name.replace(`../../${absoluteDir.split('/').pop()}/`, ''),
          start:firstFile.start,
          end: firstFile.end
        },
        secondFile: {
          path: secondFile.name.replace(`../../${absoluteDir.split('/').pop()}/`, ''),
          start:secondFile.start,
          end: secondFile.end
        }
      }
    })
    const res = {
      repeatScanLines:lines,//重复代码扫描总行数，去除了文件收尾的注释行数,其他地方的注释和空行全部包含
      duplicatedLines,//重复行数
      percentage: `${percentage}%`,//重复百分比
      data//重复代码位置
    }
    console.log('重复代码扫描结束!!!')
    return res;
  }).catch(err=>{
    console.log(`****代码重复度扫描Error:${err.message}`)
    return null;
  }).finally(()=>{
    exec(`rm -rf ${outputPath}`).catch(err=>{
      console.log(err.message);
    });
  });
}

module.exports = getRepeatCode