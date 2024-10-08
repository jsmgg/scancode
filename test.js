const path = require("path");
const glob = require("glob");
const getRepeatCode = require('./src/scan/repeat');
const getTsCover = require('./src/scan/tscover');
const getComplex = require('./src/scan/complex');
const getFileCount = require('./src/scan/fileCount');
const getSonarMsg = require('./src/scan/sonar');



async function main(){
  try{
    console.log(`${'**'.repeat(30)}开始测试${'**'.repeat(30)}`)
    const ignore = ['ignore.js','node_modules/**'];
    const root = `./test`;
    // const repeatData = await getRepeatCode(root, ignore);
    // console.log(`重复代码`,JSON.stringify(repeatData, null, '  '))
    // const tsCoverData = await getTsCover(root, ignore, true);
    // console.log(`ts覆盖率`,tsCoverData)
    // const complex = await getComplex(root, ignore);
    // console.log('complex',JSON.stringify(complex,null,'  '))

    //console.log(`fileList:size: ${getFileCount(root, ignore)}; 实际文件数：8`)
    const sonarMsg = await getSonarMsg(root, ignore);
    console.log(JSON.stringify(sonarMsg, null, ' '))
    
    console.log(`${'**'.repeat(30)}测试通过!!!${'**'.repeat(30)}`)
  }catch(err){
    console.log(`${'**'.repeat(30)}测试未通过:${err.message}${'**'.repeat(30)}`);
  }
}

main();


